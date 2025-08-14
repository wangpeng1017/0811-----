// 示例图片配置
export interface ExampleImage {
  id: string
  url: string
  alt: string
  city: string
  landmark: string
}

export const exampleImages: ExampleImage[] = [
  {
    id: 'shanghai-bund',
    url: 'https://images.unsplash.com/photo-1548919973-5cef591cdbc9?w=800&h=600&fit=crop&crop=center&q=80',
    alt: '上海外滩夜景 - 黄浦江畔著名地标建筑群，展示上海国际金融中心的城市风貌',
    city: '上海',
    landmark: '外滩'
  },
  {
    id: 'beijing-tiananmen',
    url: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&h=600&fit=crop&crop=center&q=80',
    alt: '北京天安门广场 - 中国首都标志性建筑，世界最大的城市广场之一',
    city: '北京',
    landmark: '天安门'
  },
  {
    id: 'guangzhou-tower',
    url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&h=600&fit=crop&crop=center&q=80',
    alt: '广州塔夜景 - 广州地标性建筑小蛮腰，珠江新城CBD核心区域',
    city: '广州',
    landmark: '小蛮腰'
  },
  {
    id: 'hangzhou-westlake',
    url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&h=600&fit=crop&crop=center&q=80',
    alt: '杭州西湖风景 - 世界文化遗产，中国最著名的湖泊景观之一',
    city: '杭州',
    landmark: '西湖'
  }
]

// 获取示例图片的函数
export const getExampleImages = (): ExampleImage[] => {
  return exampleImages
}

// 根据ID获取特定示例图片
export const getExampleImageById = (id: string): ExampleImage | undefined => {
  return exampleImages.find(image => image.id === id)
}
