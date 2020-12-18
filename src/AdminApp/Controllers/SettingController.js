import config from '../../../config/config';
import Setting from '../../Models/Setting';

const add = (req, res) => {
    try {
        let allData = req.body;
        const addData = new Setting(allData).save();
        res.status(200).json({msg:"Successfully added"});
    } catch (err) {
        console.log("Error => ",err.message);
        res.status(500).json({ message:"Something went wrong" });
    }
}

const details = async(req, res) => {
    try {
        const getData = await Setting.findById(
            { _id: config.SETTING_PRIMARY_ID}
        );
        res.status(200).json({data:getData});
    } catch (err) {
        console.log("Error => ",err.message);
        res.status(500).json({ message:"Something went wrong" });
    }
}

const edit = async(req, res) => {
    try {
        let allData = req.body;
        const add = await Setting.findByIdAndUpdate(
            { _id: config.SETTING_PRIMARY_ID},
            {
                $set: allData
            }
        );
        res.status(200).json({msg:"Successfully updated"});
    } catch (err) {
        console.log("Error => ",err.message);
        res.status(500).json({ message:"Something went wrong" });
    }
}
export default { add, edit, details }