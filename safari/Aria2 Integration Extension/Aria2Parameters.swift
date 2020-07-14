import Foundation

public class Aria2Parameters:Encodable {
    public let jsonRpc:String
    public var id:String
    public let method:String
    public var params:[AnyEncodable]

    init(token:String, method:String, params: [AnyEncodable]?) {
        self.jsonRpc = "2.0"
        self.id = UUID().uuidString
        self.method = method
        self.params = [AnyEncodable]()
        self.params.append(AnyEncodable(value: "token:\(token)"))
        params?.forEach { s in self.params.append(s) }
    }
}

public struct AnyEncodable: Encodable {
    let value: Encodable

    public func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        try value.encode(to: &container)
    }
}

extension Encodable {
    func encode(to container: inout SingleValueEncodingContainer) throws {
        try container.encode(self)
    }
}

