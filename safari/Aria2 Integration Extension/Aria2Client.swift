import Foundation
import Alamofire
import SwiftyJSON

public class Aria2Client {
    private let _config: Aria2Config
    public var config: Aria2Config {
        get {
            self._config
        }
    }

    private var endpoint: String {
        get {
            "http\(self.config.secure ? "s" : "")://\(self.config.host):\(self.config.port)/jsonrpc"
        }
    }

    init(config: Aria2Config) {
        self._config = config
    }

    convenience init() {
        self.init(config: Aria2Config.load())
    }

    public func addUri(uris: [String], referer: String, cookies: String, completionHandler: @escaping (Result<JSON, AFError>) -> ()) -> Void {
        var headers = JSON()
        headers["header"] = ["Referer: \(referer)", "Cookie: \(cookies)"]
        AF.request(self.endpoint, method: .post, parameters: Aria2Parameters(token: self.config.secret,
                method: "aria2.addUri", params: [AnyEncodable(value: uris), AnyEncodable(value: headers)]),
                encoder: JSONParameterEncoder.default).responseJSON { response in
            switch response.result {
            case .success(let value):
                let json = JSON(value)
                completionHandler(.success(json))
            case .failure(let error):
                completionHandler(.failure(error))
            }
        }
    }

    public func addTorrent(torrent: String, completionHandler: @escaping (Result<JSON, AFError>) -> ()) -> Void {
        AF.request(self.endpoint, method: .post, parameters: Aria2Parameters(token: self.config.secret,
                method: "aria2.addTorrent", params: [AnyEncodable(value: torrent)]),
                encoder: JSONParameterEncoder.default).responseJSON { response in
            switch response.result {
            case .success(let value):
                let json = JSON(value)
                completionHandler(.success(json))
            case .failure(let error):
                completionHandler(.failure(error))
            }
        }
    }

    public func addMetalink(metalink: String, completionHandler: @escaping (Result<JSON, AFError>) -> ()) -> Void {
        AF.request(self.endpoint, method: .post, parameters: Aria2Parameters(token: self.config.secret,
                method: "aria2.addTorrent", params: [AnyEncodable(value: metalink)]),
                encoder: JSONParameterEncoder.default).responseJSON { response in
            switch response.result {
            case .success(let value):
                let json = JSON(value)
                completionHandler(.success(json))
            case .failure(let error):
                completionHandler(.failure(error))
            }
        }
    }

    func removeDownloadResult(gid: String, completionHandler: @escaping (Result<JSON, AFError>) -> ()) -> Void {
        AF.request(self.endpoint, method: .post, parameters: Aria2Parameters(token: self.config.secret,
                method: "aria2.removeDownloadResult", params: [AnyEncodable(value: gid)]),
                encoder: JSONParameterEncoder.default).responseJSON { response in
            switch response.result {
            case .success(let value):
                let json = JSON(value)
                completionHandler(.success(json))
            case .failure(let error):
                completionHandler(.failure(error))
            }
        }
    }

    public func remove(gid: String, completionHandler: @escaping (Result<JSON, AFError>) -> ()) -> Void {
        AF.request(self.endpoint, method: .post, parameters: Aria2Parameters(token: self.config.secret,
                method: "aria2.remove", params: [AnyEncodable(value: gid)]),
                encoder: JSONParameterEncoder.default).responseJSON { response in
            switch response.result {
            case .success(let value):
                let json = JSON(value)
                completionHandler(.success(json))
            case .failure(let error):
                completionHandler(.failure(error))
            }
        }
    }

    public func pause(gid: String, completionHandler: @escaping (Result<JSON, AFError>) -> ()) -> Void {
        AF.request(self.endpoint, method: .post, parameters: Aria2Parameters(token: self.config.secret,
                method: "aria2.pause", params: [AnyEncodable(value: gid)]),
                encoder: JSONParameterEncoder.default).responseJSON { response in
            switch response.result {
            case .success(let value):
                let json = JSON(value)
                completionHandler(.success(json))
            case .failure(let error):
                completionHandler(.failure(error))
            }
        }
    }

    public func unpause(gid: String, completionHandler: @escaping (Result<JSON, AFError>) -> ()) -> Void {
        AF.request(self.endpoint, method: .post, parameters: Aria2Parameters(token: self.config.secret,
                method: "aria2.unpause", params: [AnyEncodable(value: gid)]),
                encoder: JSONParameterEncoder.default).responseJSON { response in
            switch response.result {
            case .success(let value):
                let json = JSON(value)
                completionHandler(.success(json))
            case .failure(let error):
                completionHandler(.failure(error))
            }
        }
    }

    public func getGlobalStat(completionHandler: @escaping (Result<JSON, AFError>) -> ()) -> Void {
        AF.request(self.endpoint, method: .post, parameters: Aria2Parameters(token: self.config.secret,
                method: "aria2.getGlobalStat", params: nil),
                encoder: JSONParameterEncoder.default).responseJSON { response in
            switch response.result {
            case .success(let value):
                let json = JSON(value)
                completionHandler(.success(json))
            case .failure(let error):
                completionHandler(.failure(error))
            }
        }
    }

    public func purgeDownloadResult(completionHandler: @escaping (Result<JSON, AFError>) -> ()) -> Void {
        AF.request(self.endpoint, method: .post, parameters: Aria2Parameters(token: self.config.secret,
                method: "aria2.purgeDownloadResult", params: nil),
                encoder: JSONParameterEncoder.default).responseJSON { response in
            switch response.result {
            case .success(let value):
                let json = JSON(value)
                completionHandler(.success(json))
            case .failure(let error):
                completionHandler(.failure(error))
            }
        }
    }

    public func getAllTasks(offsetWaiting: Int, numWaiting: Int,
                            offsetStopped: Int, numStopped: Int, completionHandler: @escaping (Result<JSON, AFError>) -> ()) -> Void {
        let params: [Aria2Parameters] = [
            Aria2Parameters(token: self.config.secret, method: "aria2.tellActive", params: nil),
            Aria2Parameters(token: self.config.secret, method: "aria2.tellWaiting", params: [AnyEncodable(value: offsetWaiting), AnyEncodable(value: numWaiting)]),
            Aria2Parameters(token: self.config.secret, method: "aria2.tellStopped", params: [AnyEncodable(value: offsetStopped), AnyEncodable(value: numStopped)]),
        ]
        AF.request(self.endpoint, method: .post, parameters: params,
                encoder: JSONParameterEncoder.default).responseJSON { response in
            switch response.result {
            case .success(let value):
                let json = JSON(value)
                completionHandler(.success(json))
            case .failure(let error):
                completionHandler(.failure(error))
            }
        }
    }
}
