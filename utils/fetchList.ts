import axios from "axios";

export async function fetchList(id) {
  try {
    const { data } = await axios.get(`/api/list/${id}`);
    if (data.payload) return data.payload;
    return false;
  } catch (err) {
    console.log(err);
  }
}
