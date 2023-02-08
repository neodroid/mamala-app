/* eslint no-use-before-define: 0 */
import type { NextApiRequest, NextApiResponse } from "next";

import { firestore } from "lib/firebase-admin";

const lobbyRef = firestore.collection("party");

async function joinParty(partyId: string, uid: string, nickname: string) {
  return lobbyRef
    .doc(partyId)
    .collection("players")
    .doc(uid)
    .set({ joined: true, ready: false, nickname }, { merge: true });
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { partyId, uid, nickname } = req.body;
  const joinId = await joinParty(partyId, uid, nickname);
  res.json({
    result: joinId,
  });
};
