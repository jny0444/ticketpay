const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("TicketPayModule", (m) => {
  const lock = m.contract("TicketResell", [], {});

  return { lock };
});
