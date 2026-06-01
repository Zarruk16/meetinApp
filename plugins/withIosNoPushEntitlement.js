const { withEntitlementsPlist } = require("expo/config-plugins");

/**
 * Free Apple "Personal Team" cannot use Push Notifications or Associated Domains.
 * Strip those entitlements so Xcode can sign for on-device installs.
 * Remove this plugin after enrolling in the paid Apple Developer Program ($99/yr).
 */
function withIosPersonalTeamEntitlements(config) {
  return withEntitlementsPlist(config, (config) => {
    delete config.modResults["aps-environment"];
    delete config.modResults["com.apple.developer.associated-domains"];
    return config;
  });
}

module.exports = withIosPersonalTeamEntitlements;
