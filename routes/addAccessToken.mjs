import { Router } from 'express'
import "../db.mjs"
import sanitize from 'mongo-sanitize'
import mongoose from 'mongoose';
const router = new Router()

const accessTokenRecord = mongoose.model("accessTokenRecord");

// create accessToken and send to client
router.post('/addAccessToken', async (req, res) => {
    const { username, userType, testCount } = req.body;

    const accessToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15); // generate random accessToken

    const accessTokenRecordDoc = new accessTokenRecord({
        username: sanitize(username),
        access_remaining: testCount,
        access_token: accessToken,
        is_active: true,
        user_type: userType,
    });
    await accessTokenRecordDoc.save();
    res.json({ accessToken: accessToken, message: 'accessToken added successfully' });
});

router.post('/deleteUser', async (req, res) => {
    const { userId } = req.body;
    await accessTokenRecord.deleteOne({ _id: userId });
    res.json({ success: true });
});

router.post('/inactivateUser', async (req, res) => {
    const { userId } = req.body;
    await accessTokenRecord.updateOne({ _id: userId }, { is_active: false });
    res.json({ success: true });
});

router.post('/activateUser', async (req, res) => {
    const { userId } = req.body;
    await accessTokenRecord.updateOne({ _id: userId }, { is_active: true });
    res.json({ success: true });
});

export default router;