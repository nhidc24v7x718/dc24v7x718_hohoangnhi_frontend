<template>
  <Form :validation-schema="contactFormSchema" @submit="submitContact">
    <div class="form-group">
      <label for="name">Tên</label>

      <Field
        id="name"
        v-model="contactLocal.name"
        name="name"
        type="text"
        class="form-control"
      />

      <ErrorMessage name="name" class="error-feedback" />
    </div>

    <div class="form-group">
      <label for="email">E-mail</label>

      <Field
        id="email"
        v-model="contactLocal.email"
        name="email"
        type="email"
        class="form-control"
      />

      <ErrorMessage name="email" class="error-feedback" />
    </div>

    <div class="form-group">
      <label for="address">Địa chỉ</label>

      <Field
        id="address"
        v-model="contactLocal.address"
        name="address"
        type="text"
        class="form-control"
      />

      <ErrorMessage name="address" class="error-feedback" />
    </div>

    <div class="form-group">
      <label for="phone">Điện thoại</label>

      <Field
        id="phone"
        v-model="contactLocal.phone"
        name="phone"
        type="tel"
        class="form-control"
      />

      <ErrorMessage name="phone" class="error-feedback" />
    </div>

    <div class="form-group form-check">
      <input
        id="favorite"
        v-model="contactLocal.favorite"
        name="favorite"
        type="checkbox"
        class="form-check-input"
      />

      <label for="favorite" class="form-check-label">
        <strong>Liên hệ yêu thích</strong>
      </label>
    </div>

    <div class="form-group">
      <button class="btn btn-primary">
        <i class="fas fa-save"></i>
        Lưu
      </button>

      <button
        v-if="contactLocal._id"
        type="button"
        class="ml-2 btn btn-danger"
        @click="deleteContact"
      >
        <i class="fas fa-trash"></i>
        Xóa
      </button>

      <button type="button" class="ml-2 btn btn-secondary" @click="cancel">
        Thoát
      </button>
    </div>
  </Form>
</template>

<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },

  props: {
    contact: {
      type: Object,
      required: true,
    },
  },

  emits: ["submit:contact", "delete:contact"],

  data() {
    const contactFormSchema = yup.object().shape({
      name: yup
        .string()
        .required("Tên phải có giá trị.")
        .min(2, "Tên phải ít nhất 2 ký tự.")
        .max(50, "Tên có nhiều nhất 50 ký tự."),

      email: yup
        .string()
        .email("E-mail không đúng.")
        .max(50, "E-mail tối đa 50 ký tự."),

      address: yup.string().max(100, "Địa chỉ tối đa 100 ký tự."),

      phone: yup
        .string()
        .matches(
          /((09|03|07|08|05)+([0-9]{8})\b)/g,
          "Số điện thoại không hợp lệ.",
        ),
    });

    return {
      contactLocal: { ...this.contact },
      contactFormSchema,
    };
  },

  methods: {
    submitContact() {
      this.$emit("submit:contact", this.contactLocal);
    },

    deleteContact() {
      this.$emit("delete:contact", this.contactLocal._id);
    },

    cancel() {
      const reply = window.confirm(
        "Bạn có dữ liệu chưa lưu. Bạn có muốn rời khỏi trang?",
      );

      if (reply) {
        this.$router.push({ name: "contactbook" });
      }
    },
  },
};
</script>

<style scoped>
@import "@/assets/form.css";
</style>
