import Banner from "@/components/banner";

import CourtListNew from "@/components/courtListNew";

import { ICategory } from "@/interface/category"
import { ICourtNew } from "@/interface/courtNew";

export default function Home() {
  const categories: ICategory[] = [
    { id: "1", name: "Tennis" },
    { id: "2", name: "Cầu lông" },
    { id: "3", name: "Pickleball" }
  ];
  const courtNew: ICourtNew[] = [
    {
      id: "c001",
      name: "CLB Pickleball Phú Nhuận",
      category_id: "3",
      thumbnail: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=600&auto=format&fit=crop",
      booking_count: 120,
      rating_avg: 4.9,
      address: "18A Phan Đăng Lưu, Phường 6, Phú Nhuận, TPHCM",
      min_price: 80000,
      is_new: false
    },
    {
      id: "c002",
      name: "Sân Tennis Kỳ Hòa",
      category_id: "1",
      thumbnail: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=600&auto=format&fit=crop",
      booking_count: 98,
      rating_avg: 4.7,
      address: "238 Ba Tháng Hai, Quận 10, TPHCM",
      min_price: 150000,
      is_new: false
    },
    {
      id: "c003",
      name: "Sân Cầu Lông Viettel",
      category_id: "2",
      thumbnail: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600&auto=format&fit=crop",
      booking_count: 85,
      rating_avg: 4.8,
      address: "158 Hoàng Hoa Thám, Tân Bình, TPHCM",
      min_price: 60000,
      is_new: false
    },
    {
      id: "c004",
      name: "Sân Pickleball Thảo Điền",
      category_id: "3",
      thumbnail: "https://images.unsplash.com/photo-1545224827-c8121665a371?q=80&w=600&auto=format&fit=crop",
      booking_count: 12,
      rating_avg: 5.0,
      address: "Nguyễn Văn Hưởng, Thảo Điền, Quận 2, TPHCM",
      min_price: 100000,
      is_new: true
    },
    {
      id: "c005",
      name: "CLB Tennis Lan Anh",
      category_id: "1",
      thumbnail: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=600&auto=format&fit=crop",
      booking_count: 215,
      rating_avg: 4.6,
      address: "291 Cách Mạng Tháng 8, Quận 10, TPHCM",
      min_price: 180000,
      is_new: false
    },
    {
      id: "c006",
      name: "Sân Cầu Lông Thống Nhất",
      category_id: "2",
      thumbnail: "https://images.unsplash.com/photo-1589801258579-18e091f4ca26?q=80&w=600&auto=format&fit=crop",
      booking_count: 150,
      rating_avg: 4.5,
      address: "138 Đào Duy Anh, Phú Nhuận, TPHCM",
      min_price: 70000,
      is_new: false
    },
    {
      id: "c007",
      name: "Pickleball D7 Sports",
      category_id: "3",
      thumbnail: "https://images.unsplash.com/photo-1545224827-c8121665a371?q=80&w=600&auto=format&fit=crop",
      booking_count: 45,
      rating_avg: 4.8,
      address: "Khu dân cư Him Lam, Quận 7, TPHCM",
      min_price: 120000,
      is_new: true
    },
    {
      id: "c008",
      name: "Trung Tâm Tennis Phú Thọ",
      category_id: "1",
      thumbnail: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=600&auto=format&fit=crop",
      booking_count: 320,
      rating_avg: 4.4,
      address: "219 Lý Thường Kiệt, Quận 11, TPHCM",
      min_price: 130000,
      is_new: false
    },
    {
      id: "c009",
      name: "Cầu Lông K34",
      category_id: "2",
      thumbnail: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600&auto=format&fit=crop",
      booking_count: 95,
      rating_avg: 4.7,
      address: "Bạch Đằng, Tân Bình, TPHCM",
      min_price: 65000,
      is_new: false
    },
    {
      id: "c010",
      name: "Pickleball Celadon City",
      category_id: "3",
      thumbnail: "https://images.unsplash.com/photo-1545224827-c8121665a371?q=80&w=600&auto=format&fit=crop",
      booking_count: 28,
      rating_avg: 4.9,
      address: "Khu đô thị Celadon City, Tân Phú, TPHCM",
      min_price: 90000,
      is_new: true
    }
  ]
  const courtNewHot = courtNew.sort((a, b) => b.booking_count - a.booking_count).slice(0, 4)
  const courtNewData = courtNew.filter(court => court.category_id === "1").slice(0, 4)
  return (
    <>
      <Banner></Banner>
      <CourtListNew title="Sân Chơi Phổ Biến" courtNew={courtNewHot} />
      <CourtListNew title="Sân Chơi Tennis" courtNew={courtNewData} />
    </>
  );
}