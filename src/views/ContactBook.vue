<template>
  <div class="page row">
    <!-- Thanh tìm kiếm -->
    <div class="col-md-10">
      <InputSearch v-model="searchText" />
    </div>

    <!-- Hai chức năng mở rộng -->
    <div class="mt-3 col-md-12">
      <div class="d-flex flex-wrap align-items-center">
        <!-- Chức năng 1: lọc liên hệ yêu thích -->
        <button
          type="button"
          class="btn btn-sm mr-2 mb-2"
          :class="showFavoritesOnly ? 'btn-warning' : 'btn-outline-warning'"
          @click="toggleFavorites"
        >
          <i :class="showFavoritesOnly ? 'fas fa-star' : 'far fa-star'"></i>

          {{ showFavoritesOnly ? "Đang lọc yêu thích" : "Chỉ yêu thích" }}
        </button>

        <!-- Chức năng 2: sắp xếp tên -->
        <button
          type="button"
          class="btn btn-sm btn-outline-info mr-2 mb-2"
          @click="toggleSortOrder"
        >
          <i
            :class="
              sortOrder === 'asc'
                ? 'fas fa-sort-alpha-down'
                : 'fas fa-sort-alpha-up'
            "
          ></i>

          {{ sortOrder === "asc" ? "Sắp xếp A → Z" : "Sắp xếp Z → A" }}
        </button>

        <!-- Thống kê số lượng đang hiển thị -->
        <span class="text-muted mb-2">
          Đang hiển thị
          {{ displayedContactsCount }}/{{ contacts.length }}
          liên hệ
        </span>
      </div>
    </div>

    <!-- Danh sách liên hệ -->
    <div class="mt-2 col-md-6">
      <h4>
        Danh bạ
        <i class="fas fa-address-book"></i>
      </h4>

      <ContactList
        v-if="displayedContactsCount > 0"
        :contacts="displayedContacts"
        v-model:activeIndex="activeIndex"
      />

      <p v-else>Không có liên hệ nào phù hợp.</p>

      <div class="mt-3 row justify-content-around align-items-center">
        <button
          type="button"
          class="btn btn-sm btn-primary"
          @click="refreshList"
        >
          <i class="fas fa-redo"></i>
          Làm mới
        </button>

        <button
          type="button"
          class="btn btn-sm btn-success"
          @click="goToAddContact"
        >
          <i class="fas fa-plus"></i>
          Thêm mới
        </button>

        <button
          type="button"
          class="btn btn-sm btn-danger"
          @click="removeAllContacts"
        >
          <i class="fas fa-trash"></i>
          Xóa tất cả
        </button>
      </div>
    </div>

    <!-- Chi tiết liên hệ -->
    <div class="mt-2 col-md-6">
      <div v-if="activeContact">
        <h4>
          Chi tiết Liên hệ
          <i class="fas fa-address-card"></i>
        </h4>

        <ContactCard :contact="activeContact" />

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

      // Chức năng mở rộng 1
      showFavoritesOnly: false,

      // Chức năng mở rộng 2
      // asc: A đến Z
      // desc: Z đến A
      sortOrder: "asc",
    };
  },

  watch: {
    searchText() {
      this.activeIndex = -1;
    },

    showFavoritesOnly() {
      this.activeIndex = -1;
    },

    sortOrder() {
      this.activeIndex = -1;
    },
  },

  computed: {
    /**
     * Danh sách cuối cùng sau khi:
     * 1. Tìm kiếm
     * 2. Lọc yêu thích
     * 3. Sắp xếp theo tên
     */
    displayedContacts() {
      let result = [...this.contacts];

      const keyword = this.searchText.trim().toLowerCase();

      // Tìm kiếm theo tên, email, địa chỉ và điện thoại
      if (keyword) {
        result = result.filter((contact) => {
          const contactString = [
            contact.name,
            contact.email,
            contact.address,
            contact.phone,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          return contactString.includes(keyword);
        });
      }

      // Chức năng 1: chỉ giữ lại liên hệ yêu thích
      if (this.showFavoritesOnly) {
        result = result.filter((contact) => contact.favorite === true);
      }

      // Chức năng 2: sắp xếp theo tên
      result.sort((contactA, contactB) => {
        const nameA = contactA.name || "";
        const nameB = contactB.name || "";

        const comparison = nameA.localeCompare(nameB, "vi", {
          sensitivity: "base",
        });

        return this.sortOrder === "asc" ? comparison : -comparison;
      });

      return result;
    },

    activeContact() {
      if (
        this.activeIndex < 0 ||
        this.activeIndex >= this.displayedContacts.length
      ) {
        return null;
      }

      return this.displayedContacts[this.activeIndex];
    },

    displayedContactsCount() {
      return this.displayedContacts.length;
    },
  },

  methods: {
    async retrieveContacts() {
      try {
        this.contacts = await ContactService.getAll();
      } catch (error) {
        console.log(error);
      }
    },

    refreshList() {
      this.retrieveContacts();
      this.activeIndex = -1;
    },

    /**
     * Chức năng mở rộng 1:
     * Bật hoặc tắt bộ lọc yêu thích.
     */
    toggleFavorites() {
      this.showFavoritesOnly = !this.showFavoritesOnly;
    },

    /**
     * Chức năng mở rộng 2:
     * Chuyển đổi giữa A-Z và Z-A.
     */
    toggleSortOrder() {
      this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
    },

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

    goToAddContact() {
      this.$router.push({
        name: "contact.add",
      });
    },
  },

  mounted() {
    this.refreshList();
  },
};
</script>

<style scoped>
.page {
  text-align: left;
  max-width: 800px;
}
</style>
