// groupController.js
const Group = require("../models/Group.js");
const User = require("../models/User.js");
const Message = require("../models/Message.js");

const createGroup = async (req, res) => {
  const { groupName, members, createdBy } = req.body;
  try {
    const group = await Group.create({
      name: groupName,
      memebers: memebers,
      createdBy: createdBy,
    });

    await User.updateMany(
      { _id: { $in: memebers } },
      { $push: { groups: group._id } }
    );

    return group;
  } catch (error) {
    console.log(error.message);
    throw new Error("Failed to create a new Group.");
  }
};

const deleteGroup = async (groupId) => {
  try {
    const group = await Group.findById(groupId);

    if (group) {
      const deletedGroup = await Group.findByIdAndDelete(groupId);
      await Message.deleteMany({ groupChatId: groupId });
      await User.updateMany(
        { groups: groupId },
        { $pull: { groups: groupId } }
      );
    } else {
      return console.log("No group to be deleted.");
    }

    return deleteGroup;
  } catch (error) {
    console.log(error.message);
    throw new Error("Failed to delete the Group.");
  }
};

const addMembersToGroup = async (groupId, memebersToAdd) => {
  try {
    const group = await Group.findById(groupId);

    if (!group) {
      throw new Error("Group not found.");
    }

    group.members.push(...memebersToAdd);
    await group.save();

    await User.updateMany({ groups: groupId }, { $push: { groups: groupId } });

    return group;
  } catch (error) {
    console.log(error.message);
    throw new Error("Failed to add memebers to the group.");
  }
};

const removeMembersFromGroup = async (groupId, membersToRemove) => {
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      throw new Error("No Group found.");
    }

    group.members.pull(...membersToRemove);
    await group.save();

    await User.updateMany({ groups: groupId }, { $pull: { groups: groupId } });

    return group;
  } catch (error) {
    console.log(error.message);
    throw new Error("Failed to remove members from the Group.");
  }
};

module.exports = {
  createGroup,
  addMembersToGroup,
  deleteGroup,
  removeMembersFromGroup,
};
