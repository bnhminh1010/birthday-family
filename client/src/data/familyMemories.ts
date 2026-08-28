export type FilmFrame = {
  id: string;
  image: string;
  alt: string;
  date: string;
  title: string;
  caption: string;
  frameCode: string;
  location?: string;
};

export type SliceChapter = {
  sliceId: string;
  sliceNumber: string;
  title: string;
  subtitle: string;
  description: string;
  colorTag: string;
  accentColor: string;
  coverPhoto: string;
  photos: FilmFrame[];
};

const familySketch = "/photos/family-sketch.svg";

export const familyMemories: SliceChapter[] = [
  {
    sliceId: "01",
    sliceNumber: "01",
    title: "Những Bước Chân Đầu Tiên",
    subtitle: "Tuổi Thơ & Khởi Đầu",
    description: "Nơi mọi giấc mơ bắt đầu từ chiếc bánh sinh nhật nhỏ mẹ làm, những nụ cười ngây thơ và tình yêu thương vô điều kiện của gia đình.",
    colorTag: "Tuổi Thơ",
    accentColor: "#E09F3E",
    coverPhoto: familySketch,
    photos: [
      {
        id: "c1",
        image: familySketch,
        alt: "Chiếc bánh sinh nhật đầu tiên",
        date: "2006",
        title: "Điều ước đầu đời",
        caption: "Ngọn nến đầu tiên được thắp lên cùng muôn vàn lời chúc bình an từ ba mẹ.",
        frameCode: "KODAK 400 • 01A",
        location: "Ngôi nhà nhỏ ấm áp",
      },
      {
        id: "c2",
        image: familySketch,
        alt: "Tiếng cười bên ô cửa",
        date: "2009",
        title: "Mùa hè đầy nắng",
        caption: "Những ngày chạy nhảy không biết mệt cùng ba mẹ dưới hiên nhà rực rỡ nắng vàng.",
        frameCode: "KODAK 400 • 02A",
        location: "Góc sân tuổi thơ",
      },
      {
        id: "c3",
        image: familySketch,
        alt: "Nụ cười trong veo",
        date: "2012",
        title: "Ngày đầu đến lớp",
        caption: "Bàn tay bé nhỏ nắm chặt tay mẹ trước cổng trường học ngày khai giảng.",
        frameCode: "KODAK 400 • 03A",
        location: "Cổng trường tiểu học",
      },
      {
        id: "c4",
        image: familySketch,
        alt: "Gia đình bên bàn ăn",
        date: "2014",
        title: "Bữa cơm sum vầy",
        caption: "Mỗi tối quây quần bên mâm cơm là một khoảnh khắc vô giá không gì sánh bằng.",
        frameCode: "KODAK 400 • 04A",
        location: "Bàn ăn gia đình",
      },
    ],
  },
  {
    sliceId: "02",
    sliceNumber: "02",
    title: "Chân Trời & Những Chuyến Đi",
    subtitle: "Khám Phá & Phiêu Lưu",
    description: "Cùng nhau vượt qua những con đèo, đón hoàng hôn trên biển và lưu lại từng dấu chân kỷ niệm của cả gia đình qua từng miền đất mới.",
    colorTag: "Chuyến Đi",
    accentColor: "#3D8B7A",
    coverPhoto: familySketch,
    photos: [
      {
        id: "t1",
        image: familySketch,
        alt: "Cung đường rộng mở",
        date: "2016",
        title: "Chuyến đi xa đầu tiên",
        caption: "Gió biển thổi qua khung cửa sổ xe, bài nhạc yêu thích vang lên trên suốt cung đường.",
        frameCode: "PORTRA 400 • 05A",
        location: "Đà Lạt mù sương",
      },
      {
        id: "t2",
        image: familySketch,
        alt: "Bãi biển ngập tràn ánh nắng",
        date: "2018",
        title: "Sóng vỗ biển xanh",
        caption: "Lưu lại khoảnh khắc cả nhà cùng xây lâu đài cát bên bờ biển lộng gió.",
        frameCode: "PORTRA 400 • 06A",
        location: "Bãi biển Nha Trang",
      },
      {
        id: "t3",
        image: familySketch,
        alt: "Hoàng hôn trên thung lũng",
        date: "2019",
        title: "Hoàng hôn phương xa",
        caption: "Bình yên là khi được đứng ngắm chân trời cạnh những người ta yêu thương nhất.",
        frameCode: "PORTRA 400 • 07A",
        location: "Thung lũng Mộc Châu",
      },
    ],
  },
  {
    sliceId: "03",
    sliceNumber: "03",
    title: "Vị Ngọt Những Ngày Thường",
    subtitle: "Đời Thường & Ấm Áp",
    description: "Hạnh phúc không nằm ở đâu xa xôi mà đọng lại trong từng tách cà phê sớm mai, góc bếp thơm lừng và những tiếng cười giòn tan mỗi ngày.",
    colorTag: "Đời Thường",
    accentColor: "#D4A017",
    coverPhoto: familySketch,
    photos: [
      {
        id: "d1",
        image: familySketch,
        alt: "Tách cà phê buổi sớm",
        date: "2020",
        title: "Ban mai dịu dàng",
        caption: "Một sớm chủ nhật thảnh thơi, không âu lo, chỉ có ánh nắng và tiếng cười chuyện trò.",
        frameCode: "FUJI PRO • 08A",
        location: "Ban công nhà",
      },
      {
        id: "d2",
        image: familySketch,
        alt: "Góc bếp ấm cúng",
        date: "2021",
        title: "Bếp lửa yêu thương",
        caption: "Món ăn yêu thích mà mẹ luôn tự tay nấu mỗi dịp sinh nhật về.",
        frameCode: "FUJI PRO • 09A",
        location: "Căn bếp thân quen",
      },
      {
        id: "d3",
        image: familySketch,
        alt: "Trò chuyện đêm muộn",
        date: "2022",
        title: "Chuyện trò đêm muộn",
        caption: "Kể nhau nghe về một ngày đã qua, cùng sẻ chia mọi buồn vui trong cuộc sống.",
        frameCode: "FUJI PRO • 10A",
        location: "Phòng khách ấm áp",
      },
    ],
  },
  {
    sliceId: "04",
    sliceNumber: "04",
    title: "Trưởng Thành & Tuổi Mới",
    subtitle: "Cột Mốc & Lời Chúc",
    description: "Từng nỗ lực được đền đáp, từng bước trưởng thành được chứng kiến và chúc phúc. Một lát bánh của hiện tại dành riêng cho bạn!",
    colorTag: "Hiện Tại",
    accentColor: "#E04848",
    coverPhoto: familySketch,
    photos: [
      {
        id: "m1",
        image: familySketch,
        alt: "Lễ tốt nghiệp tự hào",
        date: "2023",
        title: "Ngày chạm đến ước mơ",
        caption: "Khoảnh khắc đội chiếc mũ tốt nghiệp trong ánh mắt rạng ngời tự hào của cả nhà.",
        frameCode: "KODAK 400 • 11A",
        location: "Giảng đường đại học",
      },
      {
        id: "m2",
        image: familySketch,
        alt: "Một khởi đầu mới",
        date: "2024",
        title: "Tương lai rộng mở",
        caption: "Cùng nâng ly chúc mừng cho những bước tiến mới và thành quả đáng tự hào.",
        frameCode: "KODAK 400 • 12A",
        location: "Tổ ấm yêu thương",
      },
      {
        id: "m3",
        image: familySketch,
        alt: "Tiệc sinh nhật hôm nay",
        date: "Hôm nay",
        title: "Vì bạn, hôm nay và mãi sau",
        caption: "Chúc bạn tuổi mới luôn rạng ngời nụ cười, bình an và ngập tràn hạnh phúc!",
        frameCode: "SAFETY FILM • 13A",
        location: "Trái tim của gia đình ❤️",
      },
      {
        id: "m4",
        image: familySketch,
        alt: "Cùng nhau thổi nến",
        date: "Khoảnh khắc này",
        title: "Bữa tiệc ánh sáng",
        caption: "Nụ cười rạng rỡ dưới ánh nến lung linh. Một khởi đầu mới đầy hy vọng.",
        frameCode: "SAFETY FILM • 14A",
        location: "Gia đình",
      },
    ],
  },
];
