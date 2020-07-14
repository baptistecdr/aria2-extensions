import Cocoa

class Aria2TaskCell: NSTableCellView {
    @IBOutlet weak var filenameLabel: NSTextField!
    @IBOutlet weak var statusLabel: NSTextField!
    @IBOutlet weak var statsLabel: NSTextField!
    @IBOutlet weak var downloadProgressBar: NSProgressIndicator!
    @IBOutlet weak var pauseUnpauseButton: NSButton!

    var gid = ""
    var client: Aria2Client?
    public var isTorrent: Bool = false
    
    var state: String = "" {
        didSet {
            if state == "Active" {
                self.pauseUnpauseButton.image = NSImage(named: "NSTouchBarPauseTemplate")
                self.pauseUnpauseButton.isHidden = false
            } else if state == "Paused" {
                self.pauseUnpauseButton.image = NSImage(named: "NSTouchBarPlayTemplate")
                self.pauseUnpauseButton.isHidden = false
            } else {
                self.pauseUnpauseButton.isHidden = true
            }
        }
    }

    @IBAction func deleteTask(_ sender: Any) {
        if self.state == "Active" {
            client?.remove(gid: self.gid) { result in
                print(result)
            }
        } else {
            client?.removeDownloadResult(gid: self.gid) { result in
                print(result)
            }
        }
    }

    @IBAction func pauseOrUnpauseTask(_ sender: Any) {
        if self.state == "Active" {
            client?.pause(gid: self.gid) { result in
                print(result)
                self.pauseUnpauseButton.image = NSImage(named: "NSTouchBarPlayTemplate")
            }
        } else if self.state == "Paused" {
            client?.unpause(gid: self.gid) { result in
                print(result)
                self.pauseUnpauseButton.image = NSImage(named: "NSTouchBarPauseTemplate")
            }
        } else {
            self.pauseUnpauseButton.isHidden = true
        }
    }
}
