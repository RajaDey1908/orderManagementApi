import MembershipPlan from '../../Models/MembershipPlan';

/**
 * createPlan
 * Here admin add new membership plan page
 * return JSON
 */
const createPlan = async(req, res) => {
    try {
        const add = await new MembershipPlan(req.body)
        .save();
        res.status(200).json({msg:"Membership plan added successfully"})
    } catch (err) {
        console.log('Error => ',err.message);
        res.status(500).json({msg:"Something went wrong"});
    }
}

/**
 * listPlans
 * Here fetch all plans
 * return JSON
 */
const listPlans = async(req, res) => {
    try {
        const allplans = await MembershipPlan.find({ isDeleted: false });
        res.status(200).json({data:allplans});
    } catch (err) {
        console.log('Error => ',err.message);
        res.status(500).json({msg:"Something went wrong"});
    }
}

/**
 * listPlan
 * Here fetch all cms pages
 * return JSON
 */
const listPlan = async(req, res) => {
    if(req.params.planId == null) {
        return res.status(400).jsn({msg:"Parameter missing..."});
    }
    try {
        const planData = await MembershipPlan.findById({ _id: req.params.planId });
        res.status(200).json({data:planData});
    } catch (err) {
        console.log('Error => ',err.message);
        res.status(500).json({msg:"Something went wrong"});
    }
}

/**
 * updatePlan
 * Here update plan page
 * return JSON
 */
const updatePlan = async(req, res) => {
    if(req.params.planId == null) {
        return res.status(400).json({msg:"Parameter missing..."});
    }
    try {
        const update = await MembershipPlan.findByIdAndUpdate(
            { _id: req.params.planId },
            {
                $set: req.body
            });
        res.status(200).json({msg:"Plan updated successfully"});
    } catch (err) {
        console.log('Error => ',err.message);
        res.status(500).json({msg:"Something went wrong"});
    }
}

/**
 * deletePlan
 * Here delete plan page
 * return JSON
 */
const deletePlan = async(req, res) => {
    if(req.params.planId == null) {
        return res.status(400).json({msg:"Parameter missing..."});
    }
    try {
        const deleteData = await MembershipPlan.findByIdAndUpdate(
            { _id: req.params.planId },
            {
                $set: {
                    isDeleted: true
                }
            });
        res.status(200).json({msg:"Membership plan deleted successfully"});
    } catch (err) {
        console.log('Error => ',err.message);
        res.status(500).json({msg:"Something went wrong"});
    }
}

export default { createPlan, listPlans, listPlan, updatePlan, deletePlan }