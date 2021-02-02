import SafariServices
import SwiftyJSON

class SafariExtensionViewController: SFSafariExtensionViewController, NSTableViewDataSource, NSTableViewDelegate {
    @IBOutlet weak var tableView: NSTableView!
    @IBOutlet weak var globalStatsLabel: NSTextField!

    var aria2Client: Aria2Client?
    var byteCountFormatter = ByteCountFormatter()
    var timeRemainingFormatter = DateComponentsFormatter()

    var timer: Timer?
    var numberOfTasksActive: Int = 0
    var numberOfTasksWaiting: Int = 0
    var numberOfTasksStopped: Int = 0
    var numberOfTasks: Int {
        get {
            numberOfTasksActive + numberOfTasksWaiting + numberOfTasksStopped
        }
    }

    var tasks: JSON?

    static let shared: SafariExtensionViewController = {
        let shared = SafariExtensionViewController()
        shared.preferredContentSize = NSSize(width: 420, height: 235)
        return shared
    }()

    override func viewWillAppear() {
        aria2Client = Aria2Client(config: Aria2Config.load())
    }

    func formatSpeed(speed: String) -> String {
        self.byteCountFormatter.string(fromByteCount: Int64(speed)!)
    }

    @objc func updateGlobalStat() -> Void {
        self.aria2Client!.getGlobalStat() { result in
            switch result {
            case .success(let data):
                let downloadSpeed = data["result"]["downloadSpeed"].stringValue
                let uploadSpeed = data["result"]["uploadSpeed"].stringValue
                let downloadSpeedFormatted = self.formatSpeed(speed: downloadSpeed)
                let uploadSpeedFormatted = self.formatSpeed(speed: uploadSpeed)
                self.globalStatsLabel.stringValue = "↓ \(downloadSpeedFormatted)/s - ↑ \(uploadSpeedFormatted)/s"

                self.numberOfTasksActive = data["result"]["numActive"].intValue
                self.numberOfTasksWaiting = data["result"]["numWaiting"].intValue
                self.numberOfTasksStopped = data["result"]["numStopped"].intValue
                self.aria2Client?.getAllTasks(offsetWaiting: 0, numWaiting: self.numberOfTasksWaiting, offsetStopped: 0, numStopped: self.numberOfTasksStopped) { result in
                    switch result {
                    case .success(let data):
                        self.tasks = JSON(data[0]["result"].arrayObject! + data[1]["result"].arrayObject! + data[2]["result"].arrayObject!)
                        self.tableView.reloadData()
                    case .failure(let error):
                        print(error)
                    }
                }
            case .failure(let error):
                print(error)
            }
        }
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        tableView.delegate = self
        tableView.dataSource = self

        byteCountFormatter.allowsNonnumericFormatting = false
        byteCountFormatter.countStyle = .file

        timeRemainingFormatter.allowedUnits = [.hour, .minute, .second]
        timeRemainingFormatter.unitsStyle = .positional
        timeRemainingFormatter.zeroFormattingBehavior = .pad
    }

    override func viewDidAppear() {
        self.timer = Timer.scheduledTimer(timeInterval: 1, target: self, selector: #selector(self.updateGlobalStat), userInfo: nil, repeats: true)
    }

    override func viewDidDisappear() {
        self.timer?.invalidate()
        self.numberOfTasksActive = 0
        self.numberOfTasksWaiting = 0
        self.numberOfTasksStopped = 0
    }

    @IBAction func purgeTasks(_ sender: Any) {
        self.aria2Client!.purgeDownloadResult() { result in
            print(result)
        }
    }

    func numberOfRows(in tableView: NSTableView) -> Int {
        self.numberOfTasks
    }

    func formatEta(seconds: Int) -> String {
        self.timeRemainingFormatter.string(from: TimeInterval(seconds))!
    }

    func tableView(_ tableView: NSTableView, viewFor tableColumn: NSTableColumn?, row: Int) -> NSView? {
        guard let ariaCell = tableView.makeView(withIdentifier: NSUserInterfaceItemIdentifier(rawValue: "aria2TaskCell"), owner: self) as? Aria2TaskCell else {
            return nil
        }
        let task = self.tasks![row]

        let gid = task["gid"].stringValue
        let file = task["files"][0]
        var filename = ""
        if task["bittorrent"]["info"].exists() {
            filename = task["bittorrent"]["info"]["name"].stringValue
        } else {
            let filenameEncodedURL = file["path"].stringValue.addingPercentEncoding(withAllowedCharacters: .urlHostAllowed)!
            filename = URL(string: filenameEncodedURL)!.lastPathComponent
        }
        let fileCompletedLength = formatSpeed(speed: file["completedLength"].stringValue)
        let fileLength = formatSpeed(speed: file["length"].stringValue)
        let downloadSpeed = self.formatSpeed(speed: task["downloadSpeed"].stringValue)
        let uploadSpeed = self.formatSpeed(speed: task["uploadSpeed"].stringValue)
        let status = task["status"].stringValue.firstCapitalized
        let connections = task["connections"].stringValue
        var eta = "∞"
        if task["downloadSpeed"].intValue > 0 {
            let remainingSeconds = (file["length"].intValue - file["completedLength"].intValue) / task["downloadSpeed"].intValue
            eta = formatEta(seconds: remainingSeconds)
        }
        let percentage = round(file["completedLength"].doubleValue * 100 / file["length"].doubleValue)

        ariaCell.gid = gid
        ariaCell.isTorrent = task["bittorrent"]["info"].exists()
        ariaCell.state = status
        ariaCell.filenameLabel.stringValue = filename
        if status == "Active" {
            ariaCell.statusLabel.stringValue = "\(status), \(fileCompletedLength)/\(fileLength), ETA: \(eta)"
        } else {
            ariaCell.statusLabel.stringValue = "\(status), \(fileCompletedLength)/\(fileLength)"
        }
        ariaCell.statsLabel.stringValue = "\(connections) connection(s), ↓️ \(downloadSpeed)/s - ↑ \(uploadSpeed)/s"
        ariaCell.downloadProgressBar.doubleValue = percentage
        ariaCell.client = self.aria2Client
        return ariaCell
    }
}

// https://www.hackingwithswift.com/example-code/strings/how-to-capitalize-the-first-letter-of-a-string
extension StringProtocol {
    var firstUppercased: String {
        prefix(1).uppercased() + dropFirst()
    }
    var firstCapitalized: String {
        prefix(1).capitalized + dropFirst()
    }
}
