import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import unittest
from pathlib import Path
import scripts.loom as loom

class LoomTests(unittest.TestCase):
    def test_md_to_html(self):
        md = "# Title\n\nHello"
        html = loom.md_to_html(md)
        self.assertEqual(html, "<h1>Title</h1>\n\n<p>Hello</p>")

    def test_treeify(self):
        files = [loom.ROOT / "genesis" / "seed" / "opening.md",
                 loom.ROOT / "genesis" / "seed" / "transmission.md"]
        tree = loom.treeify(files)
        self.assertIn("genesis", tree)
        self.assertIn("seed", tree["genesis"])
        self.assertIn("opening", tree["genesis"]["seed"])
        self.assertIsInstance(tree["genesis"]["seed"]["opening"], Path)

if __name__ == '__main__':
    unittest.main()
