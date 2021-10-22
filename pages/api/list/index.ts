import { getSession } from "next-auth/client";
import { Pool } from "pg";
import { nanoid } from "nanoid";

const pool = new Pool({
  connectionString: process.env.DB_CONN_STRING,
  ssl: { rejectUnauthorized: false },
});

export default async (req, res) => {
  const session = await getSession({ req });
  const { method } = req;
  let newID = nanoid(8);
  let exists = false;

  switch (method) {
    case "POST":
      //Create new list
      try {
        const checkQuery = `SELECT EXISTS(SELECT 1 FROM lists WHERE list_id = $1)`;
        let checkResponse;
        //Re-try if list id already exists
        do {
          checkResponse = await pool.query(checkQuery, [newID]);
          if (checkResponse.rows[0].exists) {
            newID = nanoid(8);
            exists = true;
          } else {
            exists = false;
          }
        } while (exists);

        const createQuery = `INSERT INTO lists(list_id, creator) VALUES ($1, $2) RETURNING list_id`;
        const createResponse = await pool.query(createQuery, [newID, session.user.email]);
        res.status(200).json({ id: newID });
      } catch (err) {
        console.log(err);
        res.sendStatus(400);
      }
      break;
    default:
      //res.setHeader("Allow", ["GET", "PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
  //res.end();
};
