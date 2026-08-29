const GUESTBOOK_MESSAGES_SHEET = '축하글';
const GUESTBOOK_LIKES_SHEET = '좋아요';
const GUESTBOOK_MESSAGE_HEADERS = ['id', 'createdAt', 'name', 'message', 'passwordHash', 'salt', 'deletedAt'];
const GUESTBOOK_LIKE_HEADERS = ['id', 'createdAt', 'clientHash'];

function setupWeddingGuestbook() {
  const properties = PropertiesService.getScriptProperties();
  const savedSpreadsheetId = properties.getProperty('SPREADSHEET_ID');
  const spreadsheet = savedSpreadsheetId
    ? SpreadsheetApp.openById(savedSpreadsheetId)
    : SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) throw new Error('연결된 스프레드시트에서 실행해 주세요.');

  properties.setProperty('SPREADSHEET_ID', spreadsheet.getId());
  if (!properties.getProperty('PASSWORD_PEPPER')) {
    properties.setProperty('PASSWORD_PEPPER', `${Utilities.getUuid()}${Utilities.getUuid()}`);
  }

  ensureSheet_(spreadsheet, GUESTBOOK_MESSAGES_SHEET, GUESTBOOK_MESSAGE_HEADERS);
  ensureSheet_(spreadsheet, GUESTBOOK_LIKES_SHEET, GUESTBOOK_LIKE_HEADERS);
  SpreadsheetApp.flush();
  return '축하글과 좋아요 시트 준비가 완료되었습니다.';
}

function doGet(e) {
  try {
    const action = String((e && e.parameter && e.parameter.action) || 'bootstrap');
    if (action !== 'bootstrap') throw new Error('지원하지 않는 요청입니다.');
    return json_(bootstrap_(e.parameter || {}));
  } catch (error) {
    return json_({ ok: false, error: publicError_(error) });
  }
}

function doPost(e) {
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    switch (String(data.action || '')) {
      case 'createMessage': return json_(createMessage_(data));
      case 'deleteMessage': return json_(deleteMessage_(data));
      case 'like': return json_(like_(data));
      default: throw new Error('지원하지 않는 요청입니다.');
    }
  } catch (error) {
    return json_({ ok: false, error: publicError_(error) });
  }
}

function bootstrap_(params) {
  const spreadsheet = guestbookSpreadsheet_();
  const messageSheet = ensureSheet_(spreadsheet, GUESTBOOK_MESSAGES_SHEET, GUESTBOOK_MESSAGE_HEADERS);
  const likeSheet = ensureSheet_(spreadsheet, GUESTBOOK_LIKES_SHEET, GUESTBOOK_LIKE_HEADERS);
  const limit = Math.max(1, Math.min(50, Number(params.limit) || 20));
  const cursor = String(params.cursor || '');
  const rows = messageSheet.getLastRow() < 2
    ? []
    : messageSheet.getRange(2, 1, messageSheet.getLastRow() - 1, GUESTBOOK_MESSAGE_HEADERS.length).getValues();

  const visible = rows
    .filter(row => row[0] && !row[6])
    .map(row => ({
      id: String(row[0]),
      createdAt: normalizeDate_(row[1]),
      name: String(row[2]),
      message: String(row[3])
    }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const start = cursor ? Math.max(0, visible.findIndex(item => item.id === cursor) + 1) : 0;
  const messages = visible.slice(start, start + limit);
  const nextCursor = start + limit < visible.length && messages.length
    ? messages[messages.length - 1].id
    : '';
  const remainingCount = Math.max(0, visible.length - (start + messages.length));
  const clientHash = hashClient_(params.clientId || '');
  const liked = clientHash ? hasLike_(likeSheet, clientHash) : false;

  return {
    ok: true,
    messages,
    nextCursor,
    remainingCount,
    heartCount: Math.max(0, likeSheet.getLastRow() - 1),
    liked
  };
}

function createMessage_(data) {
  const name = cleanText_(data.name, 20);
  const message = cleanText_(data.message, 300, true);
  const password = String(data.password || '');
  if (!name) throw new Error('이름을 입력해 주세요.');
  if (!message) throw new Error('축하의 한 마디를 입력해 주세요.');
  if (!/^\d{4}$/.test(password)) throw new Error('비밀번호는 4자리 숫자로 입력해 주세요.');

  const clientHash = hashClient_(data.clientId || '');
  if (!clientHash) throw new Error('브라우저 정보를 확인할 수 없습니다.');
  const cache = CacheService.getScriptCache();
  if (cache.get(`message:${clientHash}`)) throw new Error('잠시 후 다시 등록해 주세요.');

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = ensureSheet_(guestbookSpreadsheet_(), GUESTBOOK_MESSAGES_SHEET, GUESTBOOK_MESSAGE_HEADERS);
    const salt = Utilities.getUuid();
    sheet.appendRow([
      Utilities.getUuid(),
      new Date().toISOString(),
      name,
      message,
      hashPassword_(password, salt),
      salt,
      ''
    ]);
    cache.put(`message:${clientHash}`, '1', 10);
    return { ok: true };
  } finally {
    lock.releaseLock();
  }
}

function deleteMessage_(data) {
  const id = String(data.id || '');
  const password = String(data.password || '');
  if (!id || !/^\d{4}$/.test(password)) throw new Error('비밀번호를 확인해 주세요.');

  const clientHash = hashClient_(data.clientId || '');
  if (!clientHash) throw new Error('브라우저 정보를 확인할 수 없습니다.');
  const cache = CacheService.getScriptCache();
  const attemptKey = `delete:${clientHash}:${id}`;
  const attempts = Number(cache.get(attemptKey) || 0);
  if (attempts >= 5) throw new Error('비밀번호 확인 횟수를 초과했습니다. 잠시 후 다시 시도해 주세요.');

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = ensureSheet_(guestbookSpreadsheet_(), GUESTBOOK_MESSAGES_SHEET, GUESTBOOK_MESSAGE_HEADERS);
    if (sheet.getLastRow() < 2) throw new Error('축하글을 찾을 수 없습니다.');
    const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, GUESTBOOK_MESSAGE_HEADERS.length).getValues();
    const index = rows.findIndex(row => String(row[0]) === id && !row[6]);
    if (index < 0) throw new Error('축하글을 찾을 수 없습니다.');
    if (hashPassword_(password, String(rows[index][5])) !== String(rows[index][4])) {
      cache.put(attemptKey, String(attempts + 1), 300);
      throw new Error('비밀번호가 일치하지 않습니다.');
    }
    sheet.getRange(index + 2, 7).setValue(new Date().toISOString());
    cache.remove(attemptKey);
    return { ok: true };
  } finally {
    lock.releaseLock();
  }
}

function like_(data) {
  const clientHash = hashClient_(data.clientId || '');
  if (!clientHash) throw new Error('브라우저 정보를 확인할 수 없습니다.');

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = ensureSheet_(guestbookSpreadsheet_(), GUESTBOOK_LIKES_SHEET, GUESTBOOK_LIKE_HEADERS);
    if (!hasLike_(sheet, clientHash)) {
      sheet.appendRow([Utilities.getUuid(), new Date().toISOString(), clientHash]);
    }
    return { ok: true, heartCount: Math.max(0, sheet.getLastRow() - 1) };
  } finally {
    lock.releaseLock();
  }
}

function guestbookSpreadsheet_() {
  const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!id) throw new Error('먼저 setupWeddingGuestbook 함수를 실행해 주세요.');
  return SpreadsheetApp.openById(id);
}

function ensureSheet_(spreadsheet, name, headers) {
  let sheet = spreadsheet.getSheetByName(name);
  if (!sheet) sheet = spreadsheet.insertSheet(name);
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#f5f0ea');
    sheet.autoResizeColumns(1, headers.length);
  }
  return sheet;
}

function hasLike_(sheet, clientHash) {
  if (sheet.getLastRow() < 2) return false;
  return sheet.getRange(2, 3, sheet.getLastRow() - 1, 1).getDisplayValues().some(row => row[0] === clientHash);
}

function hashPassword_(password, salt) {
  const pepper = PropertiesService.getScriptProperties().getProperty('PASSWORD_PEPPER');
  if (!pepper) throw new Error('서버 설정이 완료되지 않았습니다.');
  return digest_(`${pepper}:${salt}:${password}`);
}

function hashClient_(clientId) {
  const value = String(clientId || '').slice(0, 100);
  if (!value) return '';
  const pepper = PropertiesService.getScriptProperties().getProperty('PASSWORD_PEPPER');
  if (!pepper) throw new Error('서버 설정이 완료되지 않았습니다.');
  return digest_(`${pepper}:client:${value}`);
}

function digest_(value) {
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, value, Utilities.Charset.UTF_8);
  return bytes.map(byte => (`0${((byte + 256) % 256).toString(16)}`).slice(-2)).join('');
}

function cleanText_(value, maxLength, allowNewlines) {
  let text = String(value || '').replace(/[<>\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');
  text = allowNewlines ? text.replace(/\r\n?/g, '\n').trim() : text.replace(/\s+/g, ' ').trim();
  return text.slice(0, maxLength);
}

function normalizeDate_(value) {
  const date = value instanceof Date ? value : new Date(value);
  return isNaN(date.getTime()) ? '' : date.toISOString();
}

function publicError_(error) {
  const message = error && error.message ? String(error.message) : '요청을 처리하지 못했습니다.';
  console.error(error);
  return message.slice(0, 150);
}

function json_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
