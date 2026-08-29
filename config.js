/**
 * Wedding Invitation Configuration
 *
 * 이 파일에서 청첩장의 모든 정보를 수정할 수 있습니다.
 * 이미지는 설정이 필요 없습니다. 아래 폴더에 순번 파일명으로 넣으면 자동 감지됩니다.
 *
 * 이미지 폴더 구조 (파일명 규칙):
 *   images/hero/1.jpg      - 메인 사진 (1장, 필수)
 *   images/story/1.jpg, 2.jpg, ...  - 스토리 사진들 (순번, 자동 감지)
 *   images/gallery/1.jpg, 2.jpg, ... - 갤러리 사진들 (순번, 자동 감지)
 *   images/location/1.jpg  - 약도/지도 이미지 (1장)
 *   images/og/1.jpg        - 카카오톡 공유 썸네일 (1장)
 */

const CONFIG = {
  // ── 초대장 열기 ──
  useCurtain: false,  // 초대장 열기 화면 사용 여부 (true: 사용, false: 바로 본문 표시)

  // ── 메인 (히어로) ──
  groom: {
    name: "우종건",
    nameEn: "Woo JongKun",
    father: "우관호",
    mother: "이가영",
    fatherDeceased: false,
    motherDeceased: false
  },

  bride: {
    name: "이서아",
    nameEn: "Lee SeoAh",
    father: "이근호",
    mother: "박미향",
    fatherDeceased: false,
    motherDeceased: false
  },

  wedding: {
    date: "2026-11-28",
    time: "14:30",
    venue: "더채플 앳 청담",
    hall: "채플홀 (6층)",
    address: "서울특별시 강남구 선릉로 757",
    tel: "02-421-1121",
    mapLinks: {
      kakao: "https://kko.to/Cn_X0Kf0aQ",
      naver: "https://naver.me/F05mqaoE",
      tmap: "https://apis.openapi.sk.com/tmap/app/routes?name=%EB%8D%94%EC%B1%84%ED%94%8C%20%EC%95%B3%20%EC%B2%AD%EB%8B%B4&lon=127.039149&lat=37.522474"
    },
    transportation: [
      {
        title: "셔틀버스",
        description: "강남구청역 3번 출구에서 셔틀버스가 운행됩니다."
      },
      {
        title: "주차 안내",
        description: "본관 및 안내받은 외부 주차장을 이용해 주세요.\n하객 차량은 90분 무료 주차가 가능합니다."
      }
    ]
  },

  // ── 예식 안내 카드 ──
  information: [
    {
      title: "교통 안내",
      description: "주차 공간이 협소하오니, 가급적 대중교통을 이용해 주시기 바랍니다."
    },
    {
      title: "화환 안내",
      description: "환경 보호에 동참하기 위하여, 축하 화환과 화분 및 꽃바구니는 정중히 사양합니다."
    }
  ],

  // ── 인사말 ──
  greeting: {
    title: "소중한 분들을 초대합니다",
    content: "서로 다른 길을 걸어온 두 사람이\n이제 같은 길을 함께 걸어가려 합니다.\n\n저희의 새로운 시작을\n축복해 주시면 감사하겠습니다."
  },

  // ── 우리의 이야기 ──
  story: {
    title: "우리의 이야기",
    content: "서로 다른 길을 걷던 두 사람이\n하나의 길을 함께 걷게 되었습니다.\n\n여러분을 소중한 자리에 초대합니다."
  },

  // ── 오시는 길 ──
  // (mapLinks는 wedding 객체 내에 포함)

  // ── 마음 전하실 곳 ──
  accounts: {
    groom: [
      { role: "신랑", name: "우종건", bank: "국민은행", number: "933051-00-051106" },
      { role: "아버지", name: "우관호", bank: "신한은행", number: "000-000-000000" },
      { role: "어머니", name: "이가영", bank: "우리은행", number: "000-000-000000" }
    ],
    bride: [
      { role: "신부", name: "이서아", bank: "국민은행", number: "012502-04-571648" },
      { role: "아버지", name: "이근호", bank: "기업은행", number: "000-000-000000" },
      { role: "어머니", name: "박미향", bank: "농협은행", number: "000-000-000000" }
    ]
  },

  // ── 링크 공유 시 나타나는 문구 ──
  meta: {
    title: "우종건 ♥ 이서아 결혼합니다",
    description: "2026년 11월 28일, 소중한 분들을 초대합니다."
  },

  // ── 축하 전하기 ──
  // Google Apps Script를 웹 앱으로 배포한 뒤 /exec 주소를 입력하세요.
  // 스프레드시트 ID나 Google 인증정보는 이 파일에 넣지 않습니다.
  guestbook: {
    apiUrl: "https://script.google.com/macros/s/AKfycbzxmdkmlxDn6WivHLvmzx1LujpYcNblv1lQNrzUrpZJF4IkCtWRsoZGibE3QGqx-CB6/exec",
    pageSize: 5
  },

  // ── 카카오톡 공유 ──
  // Kakao Developers에서 JavaScript 키를 발급받아 입력하세요.
  // 제품 링크 관리의 웹 도메인과 JavaScript SDK 도메인에
  // https://jksa1128.github.io 를 등록해야 합니다.
  kakaoShare: {
    javascriptKey: "64b5b7c4b6ac70b68b87b8480200615f",
    url: "https://jksa1128.github.io/invitation/",
    imageUrl: "https://jksa1128.github.io/invitation/images/og/1.jpg",
    buttonTitle: "청첩장 보기"
  }
};
