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
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  poemVerse: [string, string];
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
    icon: "🌸",
    title: "Gia Đình Sum Vầy",
    subtitle: "Mái Ấm & Kỷ Niệm Chung",
    description: "Nơi bão giông dừng lại sau cánh cửa, chỉ còn lại nụ cười rạng rỡ bên mâm cơm và tình yêu thương vô điều kiện.",
    poemVerse: [
      "Trăm lối đi về, một chốn bình yên,",
      "Bếp ấm sum vầy, trọn vẹn nghĩa thân."
    ],
    colorTag: "Gia Đình",
    accentColor: "#D4973B",
    coverPhoto: familySketch,
    photos: [
      {
        id: "f1",
        image: familySketch,
        alt: "Gia đình sum vầy",
        date: "2010",
        title: "Bữa cơm ấm cúng",
        caption: "Không gì sánh bằng khoảnh khắc cả nhà quây quần sau những ngày bận rộn.",
        frameCode: "TAI-FILM • 01A",
        location: "Mái ấm thân thương",
      },
      {
        id: "f2",
        image: familySketch,
        alt: "Chuyến du lịch gia đình",
        date: "2018",
        title: "Dấu chân kỷ niệm",
        caption: "Cùng nhau đi khắp muôn nơi, đón bình minh và lưu giữ từng nụ cười rạng rỡ.",
        frameCode: "TAI-FILM • 02A",
        location: "Biển xanh nắng vàng",
      },
      {
        id: "f3",
        image: familySketch,
        alt: "Đêm tiệc sinh nhật",
        date: "2024",
        title: "Trái tim gia đình",
        caption: "Mỗi lời chúc nâng niu hạnh phúc, thắp sáng tình yêu thương đong đầy.",
        frameCode: "TAI-FILM • 03A",
        location: "Gia đình ❤️",
      },
    ],
  },
  {
    sliceId: "02",
    sliceNumber: "02",
    icon: "🌿",
    title: "Sinh Nhật Bố",
    subtitle: "Trụ Cột Vững Chãi & Ân Tình",
    description: "Dành riêng cho Bố — người luôn lặng lẽ gánh vác mọi nhọc nhằn, là điểm tựa bình yên vững vàng cho cả gia đình.",
    poemVerse: [
      "Lặng lẽ chở che qua muôn ngàn dâu bể,",
      "Tựa núi Thái Sơn, vững chãi tháng năm dài."
    ],
    colorTag: "Sinh Nhật Bố",
    accentColor: "#3B5B72",
    coverPhoto: familySketch,
    photos: [
      {
        id: "b1",
        image: familySketch,
        alt: "Bố bên tách cà phê",
        date: "Sớm mai",
        title: "Bờ vai vững chãi",
        caption: "Ánh mắt nghiêm nghị nhưng chứa đựng muôn vàn tình yêu thương lặng lẽ.",
        frameCode: "TAI-FILM • 04A",
        location: "Góc ban công",
      },
      {
        id: "b2",
        image: familySketch,
        alt: "Bố và những chuyến đi",
        date: "Kỷ niệm",
        title: "Người lái đò kiên cường",
        caption: "Cảm ơn Bố vì luôn đồng hành và hướng dẫn con trên từng bước đường đời.",
        frameCode: "TAI-FILM • 05A",
        location: "Cung đường tuổi trẻ",
      },
      {
        id: "b3",
        image: familySketch,
        alt: "Chúc mừng sinh nhật Bố",
        date: "Hôm nay",
        title: "Chúc Bố luôn mạnh khỏe",
        caption: "Mong Bố luôn bình an, nhiều sức khỏe và mãi là niềm tự hào của chúng con!",
        frameCode: "TAI-FILM • 06A",
        location: "Trái tim con ❤️",
      },
    ],
  },
  {
    sliceId: "03",
    sliceNumber: "03",
    icon: "🌼",
    title: "Sinh Nhật Mẹ",
    subtitle: "Dịu Dàng & Bếp Lửa Yêu Thương",
    description: "Dành riêng cho Mẹ — người giữ lửa yêu thương, luôn sưởi ấm căn nhà bằng nụ cười hiền hậu và sự chăm sóc bao la.",
    poemVerse: [
      "Bếp lửa thân thương thơm lừng hương vị ngọt,",
      "Ánh mắt dịu hiền sưởi ấm cả đời con."
    ],
    colorTag: "Sinh Nhật Mẹ",
    accentColor: "#C86A58",
    coverPhoto: familySketch,
    photos: [
      {
        id: "m1",
        image: familySketch,
        alt: "Căn bếp của Mẹ",
        date: "Bình yên",
        title: "Bếp lửa yêu thương",
        caption: "Nơi Mẹ chăm chút từng món ăn yêu thích cho cả gia đình mỗi ngày.",
        frameCode: "TAI-FILM • 07A",
        location: "Căn bếp nhỏ",
      },
      {
        id: "m2",
        image: familySketch,
        alt: "Nụ cười của Mẹ",
        date: "Rạng rỡ",
        title: "Ánh dương dịu dàng",
        caption: "Nụ cười rạng ngời của Mẹ là điều tuyệt vời nhất trong ngôi nhà ta.",
        frameCode: "TAI-FILM • 08A",
        location: "Góc vườn hoa",
      },
      {
        id: "m3",
        image: familySketch,
        alt: "Chúc mừng sinh nhật Mẹ",
        date: "Hôm nay",
        title: "Chúc Mẹ luôn hạnh phúc",
        caption: "Cảm ơn Mẹ vì tất cả! Chúc Mẹ tuổi mới luôn tươi trẻ, bình an và rạng rỡ.",
        frameCode: "TAI-FILM • 09A",
        location: "Yêu Mẹ rất nhiều ❤️",
      },
    ],
  },
  {
    sliceId: "04",
    sliceNumber: "04",
    icon: "✨",
    title: "Sinh Nhật Tôi",
    subtitle: "Bình Minh & Hành Trình Tuổi Mới",
    description: "Lát bánh dành cho Tôi (Bình Minh) — đón chào tuổi mới với sự tự tin, trưởng thành và lòng biết ơn sâu sắc đến gia đình.",
    poemVerse: [
      "Đón ánh ban mai rạng ngời trang sách mới,",
      "Vững bước tương lai cùng ước vọng vươn xa."
    ],
    colorTag: "Bình Minh",
    accentColor: "#D66236",
    coverPhoto: familySketch,
    photos: [
      {
        id: "bm1",
        image: familySketch,
        alt: "Bình Minh trưởng thành",
        date: "2023",
        title: "Chạm tay vào ước mơ",
        caption: "Những nỗ lực không ngừng nghỉ dưới sự cổ vũ và tin tưởng của gia đình.",
        frameCode: "TAI-FILM • 10A",
        location: "Giảng đường & Đam mê",
      },
      {
        id: "bm2",
        image: familySketch,
        alt: "Khởi đầu mới",
        date: "2024",
        title: "Tương lai rộng mở",
        caption: "Dũng cảm vươn xa, đón nhận những thử thách mới cùng sự kiên định.",
        frameCode: "TAI-FILM • 11A",
        location: "Chặng đường phía trước",
      },
      {
        id: "bm3",
        image: familySketch,
        alt: "Tuổi mới rực rỡ",
        date: "Hôm nay",
        title: "Sinh nhật Bình Minh",
        caption: "Chúc Bình Minh tuổi mới luôn bản lĩnh, sáng tạo và gặt hái muôn vàn thành công!",
        frameCode: "TAI-FILM • 12A",
        location: "ThinkAI Studio ✨",
      },
    ],
  },
];
