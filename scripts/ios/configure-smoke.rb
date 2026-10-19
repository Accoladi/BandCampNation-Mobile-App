require 'fileutils'
require 'xcodeproj'

project_path = Dir['ios/*.xcodeproj'].first or abort 'Generate the iOS project first'
project = Xcodeproj::Project.open(project_path)
app_target = project.targets.find { |target| target.product_type == 'com.apple.product-type.application' }
abort 'Missing iOS app target' unless app_target

name = 'BandCampNationSmoke'
unless project.targets.any? { |target| target.name == name }
  target = project.new_target(:ui_test_bundle, name, :ios, '16.4')
  target.add_dependency(app_target)
  folder = File.join('ios', name)
  FileUtils.mkdir_p(folder)
  FileUtils.cp('scripts/ios/SmokeTests.swift', File.join(folder, 'SmokeTests.swift'))
  group = project.main_group.new_group(name, name)
  target.source_build_phase.add_file_reference(group.new_file('SmokeTests.swift'))
  target.build_configurations.each do |config|
    config.build_settings['PRODUCT_BUNDLE_IDENTIFIER'] = 'com.bandcampnation.mobile.smoke'
    config.build_settings['TEST_TARGET_NAME'] = app_target.name
    config.build_settings['GENERATE_INFOPLIST_FILE'] = 'YES'
    config.build_settings['SWIFT_VERSION'] = '5.0'
    config.build_settings['CODE_SIGNING_ALLOWED'] = 'NO'
    config.build_settings['TARGETED_DEVICE_FAMILY'] = '1,2'
  end
  project.root_object.attributes['TargetAttributes'] ||= {}
  project.root_object.attributes['TargetAttributes'][target.uuid] = { 'TestTargetID' => app_target.uuid }
  project.save
  scheme_path = File.join(project_path, 'xcshareddata/xcschemes', "#{app_target.name}.xcscheme")
  scheme = Xcodeproj::XCScheme.new(scheme_path)
  scheme.add_build_target(target)
  scheme.add_test_target(target)
  scheme.test_action.build_configuration = 'Release'
  scheme.save_as(project_path, app_target.name)
end
puts "Configured native UI smoke tests for #{app_target.name}"
