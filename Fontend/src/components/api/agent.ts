import axios, { AxiosResponse } from "axios";
import { store } from "../../store/store";

export const baseUrl = "http://localhost:5141/";

axios.defaults.baseURL = baseUrl;

export const folderImage = baseUrl + "/images/";

const responseBody = (response: AxiosResponse) => response.data;

//เช็ค token
axios.interceptors.request.use((config) => {
  const token = store.getState().user.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const requests = {
  get: (url: string) => axios.get(url).then(responseBody),
  post: (url: string, body: object) => axios.post(url, body).then(responseBody),
  put: (url: string, body: object) => axios.put(url, body).then(responseBody),
  delete: (url: string) => axios.delete(url).then(responseBody),
  postForm: (url: string, data: FormData) =>
    axios
      .post(url, data, {
        headers: { "Content-type": "multipart/form-data" },
      })
      .then(responseBody),
  putForm: (url: string, data: FormData) =>
    axios
      .put(url, data, {
        headers: { "Content-type": "multipart/form-data" },
      })
      .then(responseBody),
  deleteForm: <T>(url: string, data?: T) =>
    axios.delete(url, { data }).then(responseBody),
};

function createFormData(item, images?) {
  const formData = new FormData();
  for (const key in item) {
    formData.append(key, item[key]);
  }
  if (images) {
    images.forEach((image) => {
      formData.append("images", image);
    });
  }

  return formData;
}

const Building = {
  getBuilding: () => requests.get("api/Building/GetBuildings"),
  creatAndUpdateBuilding: (values: object) =>
    requests.postForm("api/Building/CAUBuilding", createFormData(values)),
  removeBuilding: (id: number) =>
    requests.delete(`api/Building/RemoveBuilding?id=${id}`),
};

const Room = {
  getRooms: () => requests.get("api/Room/GetRooms"),
  creatAndUpdateRoom: (values: object, images: Array<string | File>) =>
    requests.postForm("api/Room/CAURoom", createFormData(values, images)),
  removeRoom: (id: number) => requests.delete(`api/Room/RemoveRoom?id=${id}`),
  getRoomTypes: () => requests.get("api/Room/GetRoomTypes"),
  creatAndUpdateRoomType: (values: object) =>
    requests.postForm("api/Room/CAURoomType", createFormData(values)),
  removeRoomType: (id: number) =>
    requests.delete(`api/Room/RemoveRoomType?id=${id}`),
};

const Softpower = {
  getSoftpowers: () => requests.get("api/Softpower/GetSoftpowers"),
  creatAndUpdateSoftpower: (values: object, images: Array<string | File>) =>
    requests.postForm(
      "api/Softpower/CAUSoftpower",
      createFormData(values, images)
    ),
  removeSoftpower: (id: number) =>
    requests.delete(`api/Softpower/RemoveSoftpower?id=${id}`),
  getSoftpowerTypes: () => requests.get("api/Softpower/GetSoftpowerTypes"),
  creatAndUpdateSoftpowerType: (values: object) =>
    requests.postForm("api/Softpower/CAUSoftpowerType", createFormData(values)),
  removeSoftpowerType: (id: number) =>
    requests.delete(`api/Softpower/RemoveSoftpowerType?id=${id}`),
};

const Booking = {
  getBookingAdmin: () => requests.get("api/Booking/GetBookings"),
  getBookingByUser: () => requests.get("api/Booking/GetBookingByUser"),
  getPaymentBooking: () => requests.get("api/Booking/GetBookingPayments"),
  bookingRoom: (values: object) =>
    requests.post("api/Booking/Booking", values),
  paymentBooking: (values: object) =>
    requests.postForm("api/Booking/BookingPayment", createFormData(values)),
  changeBookingStatus: (bookingPaymentId: number) =>
    requests.delete(`api/Booking/ChangeStatus?id=${bookingPaymentId}`),
  checkInUser: (id: number) =>
    requests.delete(`api/Booking/CheckInUser?id=${id}`),
  cancelBooking: (id: number) =>
    requests.delete(`api/Booking/CancelBooking?id=${id}`),
  removeManyBookingAdmin: (ids: number[]) =>
    requests.deleteForm("api/Booking/RemoveManyBooking", ids),
};

const Comment = {
  getComments: () => requests.get("api/Comment/GetComments"),
  creatAndUpdateComment: (values: object, images: Array<string | File>) =>
    requests.postForm("api/Comment/CAUComment", createFormData(values, images)),
  removeComment: (id: number) =>
    requests.delete(`api/Comment/RemoveComment?id=${id}`),

  getCommentPackages: () => requests.get("api/Comment/GetCommentPackages"),
  creatAndUpdateCommentPackage: (values: object, images: Array<string | File>) =>
    requests.postForm("api/Comment/CAUCommentPackage", createFormData(values, images)),
  removeCommentPackage: (id: number) =>
    requests.delete(`api/Comment/RemoveCommentPackage?id=${id}`),
};

const User = {
  loginUser: (values: object) => requests.post("api/Authen/Login", values),
  forgotPassword: (values: object) => requests.post("api/Authen/ForgotPassword", values),
  getByUser: () => requests.get("api/Authen/GetUserDetail"),
  getUserAdmin: () => requests.get("api/Authen/GetUsers"),
  getRoles: () => requests.get("api/Authen/GetRoles"),
  registerUser: (values: object) =>
    requests.post("api/Authen/Register", values),
  changeUser: (values: object) =>
    requests.post("api/Authen/ChangeUser", createFormData(values)),
  removeUser: (id: number) => requests.delete(`api/Authen/RemoveUser?id=${id}`),
  checkExpToken: (token: string) => requests.delete(`api/Authen/IsTokenExpired?token=${token}`),

};

const Package = {
  getPackages: () => requests.get("api/Package/GetPackages"),
  creatAndUpdatePackage: (values: object) =>
    requests.post("api/Package/CAUPackage", values),
  removePackage: (id: number) =>
    requests.delete(`api/Package/RemovePackage?id=${id}`),

  getBookingPackageAdmin: () =>
    requests.get("api/BookingPackage/GetBookingPackages"),
  getBookingPackageByUser: () =>
    requests.get("api/BookingPackage/GetBookingPackageByUser"),

  bookingPackage: (values: object) =>
    requests.post("api/BookingPackage/BookingPackage", values),
  cancelBookingPackage: (id: number) =>
    requests.delete(`api/BookingPackage/CancelBookingPackage?id=${id}`),
  removeManyBookingPackageAdmin: (ids: number[]) =>
    requests.deleteForm("api/BookingPackage/RemoveManyBookingPackage", ids),
  checkInUser: (listPackageId: number) =>
    requests.delete(`api/BookingPackage/CheckInUser?listPackageId=${listPackageId}`),
  getPaymentBookingPackage: () => requests.get("api/BookingPackage/GetBookingPackagePayments"),
  paymentBookingPackage: (values: object) =>
    requests.postForm("api/BookingPackage/BookingPackagePayment", createFormData(values)),
};

const agent = {
  Building,
  Room,
  Softpower,
  Booking,
  User,
  Comment,
  Package,
};

export default agent;
