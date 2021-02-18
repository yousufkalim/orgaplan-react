const api = ({ method = "GET", uri, body, headers, token }) =>
  new Promise(async (resolve, reject) => {
    try {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      token && myHeaders.append("Authorization", `Bearer ${token}`);

      const response = await fetch(uri, {
        method,
        headers: headers || myHeaders,
        body,
      });
      if (!response.ok) throw await response.json();
      let data = await response.json();
      console.log(`[API Data at ${new Date().toLocaleString()}]:`, uri, data);
      resolve(data);
    } catch (err) {
      console.log(`[API Error at ${new Date().toLocaleString()}]:`, err);
      reject(err);
    }
  });

export default api;
