import axios from "axios";

export async function fetchList(id) {
  try {
    const response = await axios.get(`/api/list/${id}`);
    return response.data.payload;
  } catch (err) {
    console.log(err);
  }
}
