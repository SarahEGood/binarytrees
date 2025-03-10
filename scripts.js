class Node {
    constructor (value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

class Tree {
    constructor (array) {
        let toTree = sortArray(array);
        const end = toTree.length;
        this.root = buildTree(array, 0, end - 1);
        this.size = end;
    }
    insert(value) {
        let curr = this.root;
        let last = null;
        while (curr != null) {
            last = curr;
            if (value < curr.value) {
                curr = curr.left;
            } else if (value > curr.value) {
                curr = curr.right;
            } else {
                // If the value already exists, return (do not insert it again)
                return;
            }
        }

        // If the tree was empty
        if (last == null) {
            this.root = new Node(value);
        } else if (value < last.value) {
            last.left = new Node(value);
        } else {
            last.right = new Node(value);
        }
    }
    deleteItem(value) {
        this.root = this._deleteNode(this.root, value);
        console.log("Tree after deletion:", JSON.stringify(this.root, null, 2));
    }

    _deleteNode(curr, value) {
        // if current tree is empty return itself
        if (curr === null) {
            return null;
        } else if (value < curr.value) {
            curr.left = this._deleteNode(curr.left, value);
        } else if (value > curr.value) {
            curr.right = this._deleteNode(curr.right, value);
        } else {
            if (curr.left === null && curr.right === null) {
                return curr;
            }
            if (curr.left === null) {
                return curr.right;
            } else if (curr.right === null) {
                return curr.left;
            }

            var aux = this._findMin(curr.right);
            curr.value = aux.value;

            curr.right = this._deleteNode(curr.right, aux.value);
        }
        return curr;
    }

    _findMin(node) {
        if(node.left === null)  return node;
        else return this._findMin(node.left);
    }
    find(value) {
        let curr = this.root;
        if (curr == null) {
            return null;
        }

        while (curr.value != value) {
            if (curr.value > value) {
                curr = curr.left;
            } else if (curr.value < value) {
                curr = curr.right;
            }
        }
        return curr;
    }
    levelOrder(callback, curr = [this.root]) {
        let newqueue = [];
        for (let i=0; i<curr.length; i++) {
            if (curr[i] && curr[i].value) callback(curr[i].value);
            if (curr[i] && curr[i].left) newqueue.push(curr[i].left);
            if (curr[i] && curr[i].right) newqueue.push(curr[i].right);
        }
        if (newqueue.length) {
            this.levelOrder(callback, newqueue);
        }
    }
    preOrder(callback, curr = this.root) {
        let queue = [];
        callback(curr.value);
        if (curr.left) {
            queue.push(curr.left);
        }
        if (curr.right) {
            queue.push(curr.right);
        }

        for (let i = 0; i < queue.length; i++) {
            this.preOrder(callback, queue[i]);
        }
    }
    postOrder(callback, curr = this.root) {
        let queue = [];
        if (curr.left) {
            queue.push(curr.left);
        }
        if (curr.right) {
            queue.push(curr.right);
        }

        for (let i = 0; i < queue.length; i++) {
            this.postOrder(callback, queue[i]);
        }
        callback(curr.value);
    }
    inOrder(callback, curr = this.root) {
        if (curr.left) {
            this.inOrder(callback, curr.left);
        }
        callback(curr.value);
        if (curr.right) {
            this.inOrder(callback, curr.right);
        }
    }
    height(node = this.root) {
        if (node === null) {
            return 0;
        }

        let height = 0;
        let queue = [node];

        while (queue.length !== 0) {
            let levelSize = queue.length;

            for (let i=0; i< levelSize; i++) {
                let node = queue.shift();
                if (node.left) queue.push(node.left);
                if (node.right) queue.push(node.right);
            }

            height++;
        }
        console.log(height);
        return height;
    }
    depth (node = this.root) {
        const max_height = this.height();
        console.log(max_height - this.height(node));
        return max_height - this.height(node);
    }
    isBalanced() {
        let leftside = this.root.left;
        let rightside = this.root.right;
        let leftheight = this.height(leftside);
        let rightheight = this.height(rightside);

        const heightdiff = Math.abs(leftheight-rightheight);
        if (heightdiff > 1) {
            return false;
        } else {
            return true;
        }
    }
    rebalance() {
        let treeList = [];
        this.levelOrder(value => treeList.push(value));

        const sortedList = sortArray(treeList);
        this.root = buildTree(sortedList, 0, sortedList.length - 1);
    }
}

function sortArray(array) {
    // sort tree numerically and remove dups
    array = Array.from(new Set(array));
    array = array.sort(function(a, b){return a - b});
    return array;
}

function buildTree(array, start, end) {
    if (start > end || (typeof array === 'undefined')) {
        return null;
    }

    let midpoint = start + Math.floor((end - start) / 2);

    let root = new Node(array[midpoint]);

    root.left = buildTree(array, start, midpoint-1);
    root.right = buildTree(array, midpoint+1, end);

    return root;
}

let toTree = Array.from({length:100}, () => Math.floor(Math.random() * 100));
console.log(toTree);
let tree = new Tree(sortArray(toTree));
console.log(tree.isBalanced());

for (let i = 0; i < 30; i ++) {
    tree.insert(Math.floor(Math.random() *100) + 100)
}

console.log(' ');
console.log('Inserted values');
console.log(tree.isBalanced());
console.log(tree.rebalance());
console.log(tree.isBalanced());