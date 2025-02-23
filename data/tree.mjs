const Node = function (data) {
    return {
        data,
        connections: [],
        addChild(child) {
            this.connections.push(child);
        }
    };
};

const Tree = function (root) {
    return {
        root,
        addChild(node) {
            this.root.addChild(node);
        }
    };
};

export function saveTree(tree) {
    return JSON.stringify(tree, null, 3);
}

export function inflateTree(data) {
    return JSON.parse(data);
}

export { Tree, Node };
