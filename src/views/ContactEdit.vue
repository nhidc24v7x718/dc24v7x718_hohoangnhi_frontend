<template>
  <div v-if="contact" class="page">
    <h4>Hiệu chỉnh Liên hệ</h4>

    <ContactForm
      :contact="contact"
      @submit:contact="updateContact"
      @delete:contact="deleteContact"
    />

    <p>{{ message }}</p>
  </div>
</template>

<script>
import ContactForm from "@/components/ContactForm.vue";
import ContactService from "@/services/contact.service";

export default {
  components: {
    ContactForm,
  },

  props: {
    id: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      contact: null,
      message: "",
    };
  },

  methods: {
    async getContact(id) {
      try {
        this.contact = await ContactService.get(id);
      } catch (error) {
        console.log(error);

        this.$router.push({
          name: "notfound",
          params: {
            pathMatch: this.$route.path.split("/").slice(1),
          },
          query: this.$route.query,
          hash: this.$route.hash,
        });
      }
    },

    async updateContact(data) {
      try {
        await ContactService.update(this.contact._id, data);

        alert("Liên hệ được cập nhật thành công.");

        this.$router.push({
          name: "contactbook",
        });
      } catch (error) {
        console.log(error);
        this.message = "Không thể cập nhật liên hệ.";
      }
    },

    async deleteContact() {
      const reply = window.confirm("Bạn muốn xóa Liên hệ này?");

      if (!reply) {
        return;
      }

      try {
        await ContactService.delete(this.contact._id);

        this.$router.push({
          name: "contactbook",
        });
      } catch (error) {
        console.log(error);
        this.message = "Không thể xóa liên hệ.";
      }
    },
  },

  created() {
    this.getContact(this.id);
    this.message = "";
  },
};
</script>
