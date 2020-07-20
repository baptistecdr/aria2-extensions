import Cocoa
import SafariServices.SFSafariApplication
import UserNotifications

class ViewController: NSViewController {
    @IBOutlet weak var hostTextField: NSTextField!
    @IBOutlet weak var secureCheckbox: NSButton!
    @IBOutlet weak var portTextField: NSTextField!
    @IBOutlet weak var secretTextField: NSSecureTextField!

    var aria2Config = Aria2Config.load()
    let notificationCenter = UNUserNotificationCenter.current()

    override func viewDidLoad() {
        super.viewDidLoad()
        loadConfiguration()
        self.notificationCenter.requestAuthorization(options: [.alert, .sound, .badge]) { _, _ in
            // Nothing to do
        }
    }

    @IBAction func openSafariExtensionPreferences(_ sender: AnyObject?) {
        SFSafariApplication.showPreferencesForExtension(withIdentifier: "bosp.Aria2-Integration-Extension") { _ in
            // Nothing to do
        }
    }

    func loadConfiguration() {
        self.hostTextField.stringValue = aria2Config.host
        self.secureCheckbox.state = aria2Config.secure ? .on : .off
        self.portTextField.stringValue = String(aria2Config.port)
        self.secretTextField.stringValue = aria2Config.secret
    }

    @IBAction func saveConfiguration(_ sender: Any) {
        if let port = UInt16(self.portTextField.stringValue) {
            let newConfig = Aria2Config(
                    host: self.hostTextField.stringValue,
                    secure: self.secureCheckbox.state == .on,
                    port: port,
                    secret: self.secretTextField.stringValue
            )
            if newConfig.save() {
                self.aria2Config = newConfig
            }
        }
    }
}
