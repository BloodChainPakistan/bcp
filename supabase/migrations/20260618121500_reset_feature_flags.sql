-- Restore all public features to ON. They default to on; this resets any that
-- were switched off during testing so the full site shows. Manage them anytime
-- at /admin/features.
update feature_flags set enabled = true;
