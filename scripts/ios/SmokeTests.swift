import XCTest

final class SmokeTests: XCTestCase {
    var app: XCUIApplication!

    @MainActor func control(_ label: String) -> XCUIElement {
        app.descendants(matching: .any).matching(NSPredicate(format: "label ==[c] %@", label)).firstMatch
    }

    @MainActor func tap(_ label: String) {
        for _ in 0..<10 {
            let element = control(label)
            if element.waitForExistence(timeout: 2) && element.isHittable {
                element.tap()
                return
            }
            app.swipeUp()
        }
        XCTFail("Missing visible control: \(label)")
    }

    @MainActor func expect(_ label: String) {
        XCTAssertTrue(control(label).waitForExistence(timeout: 30), "Missing state: \(label)")
    }

    @MainActor func screenshot(_ name: String) {
        let attachment = XCTAttachment(screenshot: app.screenshot())
        attachment.name = name
        attachment.lifetime = .keepAlways
        add(attachment)
    }

    @MainActor func menu(_ destination: String) {
        tap("Open navigation")
        tap(destination)
    }

    @MainActor func testNativeMVP() throws {
        continueAfterFailure = false
        app = XCUIApplication(bundleIdentifier: "com.bandcampnation.mobile")
        app.launchArguments = ["-AppleLanguages", "(en)", "-AppleLocale", "en_US"]
        app.launch()
        expect("Open navigation")
        screenshot("iOS Home")

        menu("Articles")
        tap("Read Is Marching Band a Sport or Something More?")
        expect("Available offline")
        screenshot("iOS native article")

        menu("Books")
        tap("Read The Stories Behind Marching Band")
        tap("Preface")
        expect("Available offline")
        screenshot("iOS native book")

        menu("Radio")
        if !control("Play track").waitForExistence(timeout: 30) {
            tap("Retry radio")
        }
        tap("Play track")
        expect("Playing")
        screenshot("iOS live radio")
        XCUIDevice.shared.press(.home)
        Thread.sleep(forTimeInterval: 2)
        app.activate()
        expect("Paused")
        tap("Next track")
        expect("Playing")
        tap("Pause track")
        expect("Paused")

        menu("Entertainment")
        tap("Play Trivia")
        tap("Start trivia")
        tap("University of Texas")
        tap("Next question")
        expect("Question 2 of 10")
        screenshot("iOS Trivia")

        menu("Entertainment")
        tap("Play Tic Tap Tone")
        tap("Two players")
        for cell in ["Row 1, column 1, empty", "Row 2, column 1, empty", "Row 1, column 2, empty", "Row 2, column 2, empty", "Row 1, column 3, empty"] {
            tap(cell)
        }
        expect("Trombone wins")
        app.swipeDown()
        app.swipeDown()
        screenshot("iOS Tic Tap Tone win")

        menu("Entertainment")
        tap("Play Name That Tune")
        tap("Start game")
        tap("Listen to clip")
        expect("Choose the tune")
        tap("Use a clue")
        screenshot("iOS bundled audio game")
    }
}
