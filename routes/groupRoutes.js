const router = require("express").Router();
const groupController = require("../controllers/groupController");

router.post("/", async (req, res) => {
  try {
    const newGroup = await groupController.createGroup(req, res);
    res.status(201).json("Group created successfully.");
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.delete("/:groupId", async (req, res) => {
  const groupId = req.params.groupId;
  try {
    const deletedGroup = await groupController.deleteGroup(groupId);
    res.status(200).json("Group deleted successfully.");
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.put("/:groupId/addMembers", async (req, res) => {
  const groupId = req.params.groupId;
  const { membersToAdd } = req.body;
  try {
    const updatedGroup = await groupController.addMembersToGroup(
      groupId,
      membersToAdd
    );
    res.status(200).json("Members added to the Group.");
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.put("/:groupId/removeMembers", async (req, res) => {
  const groupId = req.params.groupId;
  const { membersToRemove } = req.body;

  try {
    const updatedGroup = await groupController.removeMembersFromGroup(
      groupId,
      membersToRemove
    );
    res.status(200).json("Members removed from the Group successfully.");
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = router;