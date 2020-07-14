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

    override func contextMenuItemSelected(withCommand command: String, in page: SFSafariPage, userInfo: [String: Any]?) {
        if let userInfo = userInfo {
            let selectedText = userInfo["selectedText"]!
            let referer = userInfo["referer"] as! String
            let cookies = userInfo["cookies"] as! String
            let link: String = userInfo["link"] as! String
            let destination: DownloadRequest.Destination = { _, _ in
                let documentsURL = FileManager.default.urls(for: .downloadsDirectory, in: .userDomainMask)[0]
                let fileURL = documentsURL.appendingPathComponent("test.torrent")

                return (fileURL, [.removePreviousFile, .createIntermediateDirectories])
            }
            let headers: HTTPHeaders = [
                "Referer": referer,
                "Cookie": cookies,
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Safari/605.1.15"
            ]
            
            AF.download(link, headers: headers, to: destination).response { response in
                debugPrint(response)
            }

        }
    }
}
