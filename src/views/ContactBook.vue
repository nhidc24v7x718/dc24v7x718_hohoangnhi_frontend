<template>
  <div class="page row">
    <!-- Thanh tìm kiếm -->
    <div class="col-md-10">
      <InputSearch v-model="searchText" />
    </div>

    <!-- Danh sách liên hệ -->
    <div class="mt-3 col-md-6">
      <h4>
        Danh bạ
        <i class="fas fa-address-book"></i>
      </h4>

      <ContactList
        v-if="filteredContactsCount > 0"
        :contacts="filteredContacts"
        v-model:activeIndex="activeIndex"
      />

      <p v-else>Không có liên hệ nào.</p>

      <!-- Các nút chức năng -->
      <div class="mt-3 row justify-content-around align-items-center">
        <button class="btn btn-sm btn-primary" @click="refreshList">
          <i class="fas fa-redo"></i>
          Làm mới
        </button>

        <button class="btn btn-sm btn-success" @click="goToAddContact">
          <i class="fas fa-plus"></i>
          Thêm mới
        </button>

        <button class="btn btn-sm btn-danger" @click="removeAllContacts">
          <i class="fas fa-trash"></i>
          Xóa tất cả
        </button>
      </div>
    </div>

    <!-- Chi tiết liên hệ -->
    <div class="mt-3 col-md-6">
      <div v-if="activeContact">
        <h4>
          Chi tiết Liên hệ
          <i class="fas fa-address-card"></i>
        </h4>

        <ContactCard :contact="activeContact" />

        <!-- Liên kết đến trang cập nhật -->
        <router-link
          :to="{
            name: 'contact.edit',
            params: {
              id: activeContact._id,
            },
          }"
        >
          <span class="mt-2 badge badge-warning">
            <i class="fas fa-edit"></i>
            Hiệu chỉnh
          </span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import ContactCard from "@/components/ContactCard.vue";
import InputSearch from "@/components/InputSearch.vue";
import ContactList from "@/components/ContactList.vue";
import ContactService from "@/services/contact.service";

export default {
  components: {
    ContactCard,
    InputSearch,
    ContactList,
  },

  data() {
    return {
      contacts: [],
      activeIndex: -1,
      searchText: "",
    };
  },

  watch: {
    // Khi nội dung tìm kiếm thay đổi,
    // bỏ chọn liên hệ đang được chọn.
    searchText() {
      this.activeIndex = -1;
    },
  },

  computed: {
    // Chuyển thông tin mỗi contact thành chuỗi để tìm kiếm.
    contactStrings() {
      return this.contacts.map((contact) => {
        const { name, email, address, phone } = contact;

        return [name, email, address, phone]
          .filter(Boolean)
          .join("")
          .toLowerCase();
      });
    },

    // Lọc danh sách theo tên, email, địa chỉ hoặc số điện thoại.
    filteredContacts() {
      const searchText = this.searchText.trim().toLowerCase();

      if (!searchText) {
        return this.contacts;
      }

      return this.contacts.filter((_contact, index) =>
        this.contactStrings[index].includes(searchText),
      );
    },

    // Contact đang được chọn.
    activeContact() {
      if (this.activeIndex < 0) {
        return null;
      }

      return this.filteredContacts[this.activeIndex];
    },

    // Số contact sau khi lọc.
    filteredContactsCount() {
      return this.filteredContacts.length;
    },
  },

  methods: {
    // Lấy toàn bộ contact từ backend.
    async retrieveContacts() {
      try {
        this.contacts = await ContactService.getAll();
      } catch (error) {
        console.log(error);
      }
    },

    // Làm mới danh sách.
    refreshList() {
      this.retrieveContacts();
      this.activeIndex = -1;
    },

    // Xóa toàn bộ contact.
    async removeAllContacts() {
      const reply = window.confirm("Bạn muốn xóa tất cả Liên hệ?");

      if (!reply) {
        return;
      }

      try {
        await ContactService.deleteAll();
        this.refreshList();
      } catch (error) {
        console.log(error);
      }
    },

    // Chuyển đến trang thêm contact.
    goToAddContact() {
      this.$router.push({
        name: "contact.add",
      });
    },
  },

  // Khi trang được hiển thị, lấy danh sách từ backend.
  mounted() {
    this.refreshList();
  },
};
</script>

<style scoped>
.page {
  text-align: left;
  max-width: 750px;
}
</style>
