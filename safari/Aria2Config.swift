import Foundation

public class Aria2Config: Codable {
    private static let storage: UserDefaults? = UserDefaults(suiteName: "group.bosp.Aria2-Integration")

    private let _host: String
    private let _secure: Bool
    private let _port: UInt16
    private let _secret: String

    public var host: String {
        get {
            self._host
        }
    }

    public var secure: Bool {
        get {
            self._secure
        }
    }

    public var port: UInt16 {
        get {
            self._port
        }
    }

    public var secret: String {
        get {
            self._secret
        }
    }

    init(host: String, secure: Bool, port: UInt16, secret: String) {
        self._host = host
        self._secure = secure
        self._port = port
        self._secret = secret
    }

    convenience init() {
        self.init(host: "localhost", secure: false, port: 6800, secret: "")
    }

    public static func load() -> Aria2Config {
        if let storage = Aria2Config.storage{
            let host = storage.string(forKey: "host")
            let port = storage.string(forKey: "port")
            let secure = storage.bool(forKey: "secure")
            let query: [String: Any] = [kSecAttrService as String: "Aria2-Integration",
                                        kSecClass as String: kSecClassGenericPassword as String,
                                        kSecAttrAccount as String: "secret",
                                        kSecMatchLimit as String: kSecMatchLimitOne as String,
                                        kSecReturnData as String: true,
                                        kSecReturnAttributes as String: true]

            var result: AnyObject?
            let status = SecItemCopyMatching(query as CFDictionary, &result)
            if status == errSecSuccess, let resultDictionary = result as? [String: Any],
               let data = resultDictionary[kSecValueData as String] as? Data {
                let secret = String(data: data, encoding: .utf8) ?? ""
                return Aria2Config(host: host!, secure: secure, port: UInt16(port!)!, secret: secret)
            }
        }
        return Aria2Config()
    }

    public func save() -> Bool {
        if let storage = Aria2Config.storage {
            storage.set(self.host, forKey: "host")
            storage.set(self.secure, forKey: "secure")
            storage.set(self.port, forKey: "port")

            var query: [String: Any] = [kSecClass as String: kSecClassGenericPassword,
                                        kSecAttrService as String: "Aria2-Integration",
                                        kSecAttrAccount as String: "secret"]

            SecItemDelete(query as CFDictionary)
            query[kSecValueData as String] = self.secret.data(using: .utf8)!
            return SecItemAdd(query as CFDictionary, nil) == errSecSuccess
        }
        return false
    }
}
