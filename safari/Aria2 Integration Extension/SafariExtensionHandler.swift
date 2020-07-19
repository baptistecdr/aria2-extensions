import SafariServices
import Alamofire
import UserNotifications

class SafariExtensionHandler: SFSafariExtensionHandler {
    let aria2Client = Aria2Client()
    let notificationCenter = UNUserNotificationCenter.current()

    override func validateToolbarItem(in window: SFSafariWindow, validationHandler: @escaping (Bool, String) -> Void) {
        validationHandler(true, "")
        self.notificationCenter.requestAuthorization(options: [.alert, .sound, .badge]) { _, _ in
            // Nothing to do
        }
    }

    override func popoverViewController() -> SFSafariExtensionViewController {
        return SafariExtensionViewController.shared
    }

    func downloadTorrentOrMetalinkFile(link: String, referer: String, cookies: String, completionHandler: @escaping (Result<String, AFError>) -> ()) {
        let headers: HTTPHeaders = [
            "Referer": referer,
            "Cookie": cookies
        ]
        AF.download(link, headers: headers).responseData { response in
            switch response.result {
            case (.success(let data)):
                completionHandler(.success(data.base64EncodedString()))
            case .failure(let error):
                completionHandler(.failure(error))
            }
        }
    }

    func handleLink(link: String, referer: String, cookies: String) {
        if link ~= "^(https?:|ftps?:|magnet:)" {
            let isTorrentFile = link ~= "\\.torrent$"
            let isMetalinkFile = link ~= "\\.(metalink|meta4)$"
            if isTorrentFile || isMetalinkFile {
                downloadTorrentOrMetalinkFile(link: link, referer: referer, cookies: cookies) { result in
                    switch result {
                    case (.success(let data)):
                        if isTorrentFile {
                            self.aria2Client.addTorrent(torrent: data) { result in
                                switch result {
                                case (.success(_)):
                                    self.showNotification(title: "Torrent added successfully", body: "The torrent file has been added to Aria2.")
                                case (.failure(_)):
                                    self.showNotification(title: "Failed to add torrent file", body: "An error occurred when adding the torrent file.")
                                }
                            }
                        } else {
                            self.aria2Client.addMetalink(metalink: data) { _ in
                                switch result {
                                case (.success(_)):
                                    self.showNotification(title: "Metalink added successfully", body: "The metalink file has been added to Aria2.")
                                case (.failure(_)):
                                    self.showNotification(title: "Failed to add metalink file", body: "An error occurred when adding the metalink file.")
                                }
                            }
                        }
                    case .failure(_):
                        self.showNotification(title: "Failed to download the torrent/metalink file", body: "The torrent/metalink file could not be downloaded.")
                    }
                }
            } else {
                self.aria2Client.addUri(uris: [link], referer: referer, cookies: cookies) { result in
                    switch result {
                    case (.success(_)):
                        self.showNotification(title: "Link added successfully", body: "The link has been added to Aria2.")
                    case (.failure(_)):
                        self.showNotification(title: "Failed to add link", body: "An error occurred when adding the link.")
                    }
                }
            }
        }
    }

    func showNotification(title: String, body: String) {
        self.notificationCenter.getNotificationSettings { settings in
            guard (settings.authorizationStatus == .authorized) ||
                  (settings.authorizationStatus == .provisional) else { return }
            let content = UNMutableNotificationContent()
            content.title = title
            content.body = body
            content.sound = .default
            let request = UNNotificationRequest(identifier: UUID().uuidString, content: content, trigger: nil)
            self.notificationCenter.add(request)
        }
    }

    override func contextMenuItemSelected(withCommand command: String, in page: SFSafariPage, userInfo: [String: Any]?) {
        if let userInfo = userInfo {
            let selectedText = userInfo["selectedText"] as! String
            let referer = userInfo["referer"] as! String
            let cookies = userInfo["cookies"] as! String

            selectedText.split(separator: "\n").forEach {
                handleLink(link: String($0), referer: referer, cookies: cookies)
            }
            if let link = userInfo["link"] as? String {
                handleLink(link: link, referer: referer, cookies: cookies)
            }
        }
    }
}

// https://www.hackingwithswift.com/articles/108/how-to-use-regular-expressions-in-swift
extension String {
    static func ~=(lhs: String, rhs: String) -> Bool {
        guard let regex = try? NSRegularExpression(pattern: rhs) else {
            return false
        }
        let range = NSRange(location: 0, length: lhs.utf16.count)
        return regex.firstMatch(in: lhs, options: [], range: range) != nil
    }
}
