import SafariServices
import Alamofire

class SafariExtensionHandler: SFSafariExtensionHandler {
    let aria2Client = Aria2Client()

    override func validateToolbarItem(in window: SFSafariWindow, validationHandler: @escaping (Bool, String) -> Void) {
        validationHandler(true, "")
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
                            self.aria2Client.addTorrent(torrent: data) {
                                print($0)
                            }
                        } else {
                            self.aria2Client.addMetalink(metalink: data) {
                                print($0)
                            }
                        }
                    case .failure(let error):
                        print(error)
                    }
                }
            } else {
                self.aria2Client.addUri(uris: [link], referer: referer, cookies: cookies) {
                    print($0)
                }
            }
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
