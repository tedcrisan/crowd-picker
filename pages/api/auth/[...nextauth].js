import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { Pool } from "pg";
import { nanoid } from "nanoid";

const pool = new Pool({
  connectionString: process.env.DB_CONN_STRING,
  ssl: { rejectUnauthorized: false },
});

export default NextAuth({
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async signIn(user, account, profile) {
      const query = `INSERT INTO users(user_id, email) VALUES ($1, $2) ON CONFLICT DO NOTHING`;

      pool
        .query(query, [nanoid(12), user.email])
        .then((res) => {
          console.log("user:", res.rows[0]);
        })
        .catch((err) => console.log(err));

      return true;
    },
  },
});
