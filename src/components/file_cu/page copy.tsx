import ProductList from "@/components/productList";
import { IProduct } from "@/interface/product";
import Banner from "@/components/banner";
import { ICourt } from "@/interface/court";
import CourtList from "@/components/courtList";

export default function Home() {
  const productHot: IProduct[] = [
    {
      id: 1,
      name: "Product 1",
      price: 10.99,
      sale_price: 8.99,
      image: "https://via.placeholder.com/150",
      description: "This is product 1",
      stock: 5,
    },
    {
      id: 2,
      name: "Product 2",
      price: 15.99,
      sale_price: 13.99,
      image: "https://via.placeholder.com/150",
      description: "This is product 2",
      stock: 3,
    },
    {
      id: 3,
      name: "Product 3",
      price: 20.99,
      sale_price: 18.99,
      image: "https://via.placeholder.com/150",
      description: "This is product 3",
      stock: 10,
    },
  ];
  const courts: ICourt[] = [
    {
      id: "c001",
      name: "CLB Pickleball Phú Nhuận",
      sport_type: "Pickleball",
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
      sport_type: "Tennis",
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
      sport_type: "Cầu lông",
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
      sport_type: "Pickleball",
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
      sport_type: "Tennis",
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
      sport_type: "Cầu lông",
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
      sport_type: "Pickleball",
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
      sport_type: "Tennis",
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
      sport_type: "Cầu lông",
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
      sport_type: "Pickleball",
      thumbnail: "https://images.unsplash.com/photo-1545224827-c8121665a371?q=80&w=600&auto=format&fit=crop",
      booking_count: 28,
      rating_avg: 4.9,
      address: "Khu đô thị Celadon City, Tân Phú, TPHCM",
      min_price: 90000,
      is_new: true
    }
  ];
  const courtHot = courts.sort((a, b) => b.booking_count - a.booking_count).slice(0, 4);
  const courtNew = courts.filter(court => court.is_new).slice(0, 4);
  return (
    <>
      <Banner></Banner>
      {/* <ProductList title="Sản phẩm bán chạy" products={productHot}/> */}
      <CourtList title="Sân Chơi Phổ Biến" courts={courtHot} />
      <CourtList title="Sân Chơi Mới Ra Mắt" courts={courtNew} />
    </>
  );
}