import math
import json
from collections import defaultdict


class TrieNode:
    def __init__(self):
        self.children = defaultdict(TrieNode)
        self.is_end_of_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for char in word:
            node = node.children[char]
        node.is_end_of_word = True

    def search(self, word, max_distance):
        results = []
        self._search_util(self.root, word, max_distance, '', results)
        return results

    def _search_util(self, node, query, remaining_distance, current_word, results):
        if not query and node.is_end_of_word and current_word not in results:
            results.append(current_word)
        if not query:
            return
        if not node.children:
            return

        for char, child_node in node.children.items():
            new_distance = remaining_distance
            if char != query[0]:
                new_distance -= 1
            if new_distance < 0:
                continue
            self._search_util(child_node, query[1:], new_distance, current_word + char, results)

        # Special case: First character mismatch
        if remaining_distance > 0:
            for char, child_node in node.children.items():
                new_distance = remaining_distance - 1
                self._search_util(child_node, query, new_distance, current_word + char, results)
    def serialize(self):
        def serialize_node(node):
            if not node.children:
                return (node.is_end_of_word, [])
            return (node.is_end_of_word, [(char, serialize_node(child_node)) for char, child_node in node.children.items()])

        return serialize_node(self.root)

    @staticmethod
    def deserialize(serialized_data):
        def deserialize_node(data):
            is_end_of_word, children_data = data
            node = TrieNode()
            node.is_end_of_word = is_end_of_word
            node.children = defaultdict(TrieNode, [(char, deserialize_node(child_data)) for char, child_data in children_data])
            return node

        trie = Trie()
        trie.root = deserialize_node(serialized_data)
        return trie

    def save_trie(self, filename):
        serialized_data = self.serialize()
        with open(filename, 'w') as file:
            json.dump(serialized_data, file)

    # Load data from a file
    def load_trie(self,filename):
        with open(filename, 'r') as file:
            serialized_data = json.load(file)
        return Trie.deserialize(serialized_data)

class Ok:
    def __init__(self,trie):
        self.trie = trie
        
    def GETURLSIMILARITYINDEX(self,Src, Tar):
        X, Y, n = self.GETMIN(Src, Tar)
        LengthOfLongestURL = max(len(Src), len(Tar))
        SimilarityIndex = 0
        BaseValue = 50 / LengthOfLongestURL
        SumOfNaturalNumbers = (LengthOfLongestURL * (LengthOfLongestURL + 1)) / 2
        for i in range(0, n):
            if X[i] == Y[i]:
                SimilarityIndex += BaseValue + (50 * (n - i)) / SumOfNaturalNumbers
            else:
                Y = Y[:i] + Y[i+1:]
                X, Y, n = self.GETMIN(Src, Tar)
                i -= 1
        return SimilarityIndex
    
    def GETMIN(self,Src, Tar):
        return min(Src, Tar), max(Src, Tar), min(len(Src), len(Tar))
    
    
    def get_result_for_domain(self,domain):
        query_domain = domain.replace("www.", "")
        max_distance = len(query_domain) - math.floor(0.8 * len(query_domain))
        max_distance = 3 if max_distance>=3 else max_distance
        suggestions = self.trie.search(query_domain, max_distance)
        results = []
        for suggestion in suggestions:
            results.append({"domain": suggestion, "score": self.GETURLSIMILARITYINDEX(query_domain, suggestion)})
        try:
            return max(results, key=lambda x: x["score"])
        except ValueError:
            return {"domain": domain, "score": 0}

def similar_domain_search(domain,trie):
    # trie = Trie()
    # print("loading trie")
    # trie = trie.load_trie("test_flask/models/exports/trie_data.json")
    ok = Ok(trie=trie)
    return ok.get_result_for_domain(domain)['score']