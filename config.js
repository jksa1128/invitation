/**
 * Wedding Invitation Configuration
 *
 * 이 파일에서 청첩장의 모든 정보를 수정할 수 있습니다.
 * 이미지는 아래 images 설정의 개수와 경로를 사용합니다.
 *
 * 이미지 폴더 구조 (파일명 규칙):
 *   images/hero/1.jpg      - 메인 사진 (1장, 필수)
 *   images/story/1.jpg, 2.jpg, ...  - 스토리 사진들
 *   images/gallery/thumb/1.jpg, ...   - 갤러리 썸네일
 *   images/gallery/display/1.jpg, ... - 갤러리 화면용
 *   images/gallery/full/1.jpg, ...    - 갤러리 팝업용
 *   images/location/1.jpg  - 약도/지도 이미지 (1장)
 *   images/og/1.jpg        - 카카오톡 공유 썸네일 (1장)
 */

const CONFIG = {
  // ── 초대장 열기 ──
  useCurtain: false,  // 초대장 열기 화면 사용 여부 (true: 사용, false: 바로 본문 표시)

  // ── 이미지 리소스 ──
  // 사진 교체 시 count를 실제 파일 수에 맞춰 주세요.
  // 썸네일/화면용/팝업용 파일을 분리하면 각 path만 변경하면 됩니다.
  images: {
    story: {
      count: 2,
      path: "images/story"
    },
    gallery: {
      count: 21,
      thumbPath: "images/gallery/thumb",
      displayPath: "images/gallery/display",
      fullPath: "images/gallery/full"
    }
  },

  // ── 메인 (히어로) ──
  groom: {
    name: "우종건",
    nameEn: "Woo JongGun",
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
    content: "각자의 꿈을 향해 달리던 두 사림이\n같은 시선으로 세상을 바라보는 서로를 만나\n함께하는 여정을 약속합니다.\n\n따뜻한 마음으로 오셔서\n저희의 첫걸음을 축복해 주시면 감사하겠습니다."
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
      { role: "신랑", name: "우종건", bank: "국민은행", number: "933502-00-051106" },
      { role: "아버지", name: "우관호", bank: "하나은행", number: "298-810382-11707" },
      { role: "어머니", name: "이가영", bank: "국민은행", number: "371102-04-001644" }
    ],
    bride: [
      { role: "신부", name: "이서아", bank: "국민은행", number: "469302-01-290317" },
      { role: "아버지", name: "이근호", bank: "신한은행", number: "110-368-868810" },
      { role: "어머니", name: "박미향", bank: "국민은행", number: "619001-04-156489" }
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
