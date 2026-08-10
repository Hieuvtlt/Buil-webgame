export function LuyenDanScreen() {
  return `
    <div class="profession-screen">
      <h3 class="panel-title-sm">Luyện đan</h3>
      <div class="profession-layout">
        <section class="profession-panel"><h4>Đan phương</h4><div class="profession-item is-selected" data-col="dan" data-rank="chon">Đan dược cơ bản</div><div class="profession-item" data-col="dan" data-rank="ha">Hạ phẩm</div></section>
        <section class="profession-panel"><h4>Phẩm cấp</h4><div class="profession-rank is-selected" data-col="dan" data-rank="ha">Hạ phẩm</div><div class="profession-rank" data-col="dan" data-rank="trung">Trung phẩm</div><div class="profession-rank" data-col="dan" data-rank="thuong">Thượng phẩm</div><div class="profession-rank" data-col="dan" data-rank="cuc">Cực phẩm</div></section>
        <section class="profession-panel"><h4>Thông tin</h4><div class="product-line">Tên: <b>Đan dược</b></div><div class="product-line">Phẩm cấp: <b>Hạ phẩm</b></div><div class="product-line">Yêu cầu: <b>-</b></div><div class="product-line">Mô tả: <b>Chưa có dữ liệu</b></div></section>
      </div>
    </div>`
}
