/* eslint no-use-before-define: 0 */
import type { NextApiRequest, NextApiResponse } from "next";

import { firestore } from "lib/firebase-admin";

const lobbyRef = firestore.collection("party");

async function searchPartyUsingCode(code: string) {
  const query = await lobbyRef.where("code", "==", code).get();
  if (query.empty) {
    return null;
  }
  return {
    result: query.docs[0].id,
    ...query.docs[0].data(),
  };
}

async function searchPartyUsingId(id: string) {
  const query = await lobbyRef.doc(id).get();
  if (query.exists) {
    return query.data();
  }
  return null;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { code, id } = req.body;
  if (code) {
    const result = await searchPartyUsingCode(code);
    res.json(result);
  } else if (id) {
    const result = await searchPartyUsingId(id);
    res.json(result);
  } else {
    res.json({
      result: null,
    });
  }
};
