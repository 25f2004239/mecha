export const getChallengeCode = (topic: string, language: string) => {
  if (topic === 'list_iteration') {
    if (language === 'java') {
      return { title: 'Array Iteration (Java)', code: 'int[] numbers = {1, 2, 3};\nfor (int i = 1; i <= numbers.length; i++) {\n    System.out.println(numbers[i]);\n}\n// Why does this throw an ArrayIndexOutOfBoundsException?' };
    } else if (language === 'rust') {
      return { title: 'Array Iteration (Rust)', code: 'let numbers = [1, 2, 3];\nfor i in 1..=numbers.len() {\n    println!("{}", numbers[i]);\n}\n// Why does this panic?' };
    } else if (language === 'javascript' || language === 'cpp') {
      return { title: 'Array Iteration', code: 'const numbers = [1, 2, 3];\nfor (let i = 1; i <= numbers.length; i++) {\n    console.log(numbers[i]);\n}' };
    } else if (language === 'c') {
      return { title: 'Array Iteration (C)', code: 'int numbers[] = {1, 2, 3};\nfor (int i = 1; i <= 3; i++) {\n    printf("%d\\n", numbers[i]);\n}\n// Why does this print garbage at the end?' };
    } else if (language === 'html') {
      return { title: 'List Iteration (HTML)', code: '<ul>\n  <li>Item 1</li>\n  <li>Item 2\n  <li>Item 3</li>\n</ul>\n<!-- Why is the layout breaking? -->' };
    } else if (language === 'css') {
      return { title: 'List Iteration (CSS)', code: 'ul li:nth-child(0) {\n  color: red;\n}\n/* Why is not the first item turning red? */' };
    } else {
      return { title: 'List Iteration (Python)', code: 'numbers = [1, 2, 3]\n\nfor i in range(1, len(numbers)):\n    print\n# Something is missing here!' };
    }
  }

  if (topic === 'mutable_defaults') {
    if (language === 'java') {
      return { title: 'Static State (Java)', code: 'class ShoppingCart {\n    static List<String> items = new ArrayList<>();\n    void addItem(String item) {\n        items.add(item);\n    }\n}\n// Why do all carts share the same items?' };
    } else if (language === 'rust') {
      return { title: 'Borrow Checker (Rust)', code: 'fn add(mut lst: Vec<i32>) {\n    lst.push(1);\n}\n\nlet my_vec = vec![0];\nadd(my_vec);\nprintln!("{:?}", my_vec);\n// Why does the compiler complain about moving?' };
    } else if (language === 'c' || language === 'cpp') {
      return { title: 'Static State (C/C++)', code: 'void addItem(int item) {\n    static int items[10];\n    static int count = 0;\n    items[count++] = item;\n}\n// Why is the state shared across different calls?' };
    } else if (language === 'javascript') {
      return { title: 'Mutable Default Arguments (JS)', code: 'function addItem(item, list = []) {\n    list.push(item);\n    return list;\n}\nconsole.log(addItem("apple"));\nconsole.log(addItem("banana"));\n// Why does JS do this correctly but Python does not?' };
    } else if (language === 'html') {
      return { title: 'Shared IDs (HTML)', code: '<form id="myForm">\n  <input type="text" id="username" />\n</form>\n<form id="myOtherForm">\n  <input type="text" id="username" />\n</form>\n<!-- Why does document.getElementById("username") behave weirdly? -->' };
    } else if (language === 'css') {
      return { title: 'Global Styles (CSS)', code: 'button {\n  background-color: blue;\n}\n/* Why are ALL buttons turning blue instead of just the primary one? */' };
    } else {
      return { title: 'Mutable Default Arguments (Python)', code: 'def add_item(item, my_list=[]):\n    my_list.append(item)\n    return my_list\n\nprint(add_item("apple"))\nprint(add_item("banana"))\n# Why does it print ["apple", "banana"] the second time?' };
    }
  }

  if (topic === 'variable_shadowing') {
    if (language === 'java') {
      return { title: 'Variable Shadowing (Java)', code: 'class Game {\n    int score = 10;\n    void updateScore(int val) {\n        int score = val * 2;\n    }\n}\n// Why does the class score stay 10?' };
    } else if (language === 'rust') {
      return { title: 'Variable Shadowing (Rust)', code: 'let x = 10;\n{\n    let x = x * 2;\n}\nprintln!("{}", x);\n// Why does this print 10?' };
    } else if (language === 'c' || language === 'cpp') {
      return { title: 'Variable Shadowing (C/C++)', code: 'int x = 10;\nvoid update() {\n    int x = 20;\n}\n// Why is the global x still 10?' };
    } else if (language === 'javascript') {
      return { title: 'Variable Shadowing (JS)', code: 'let x = 10;\nfunction update() {\n    let x = 20;\n}\nupdate();\nconsole.log(x);\n// Why does this print 10?' };
    } else if (language === 'html') {
      return { title: 'Inline Styles (HTML)', code: '<style>\n  .text-red { color: red !important; }\n</style>\n<p class="text-red" style="color: blue;">Hello</p>\n<!-- Wait, which color will this be? -->' };
    } else if (language === 'css') {
      return { title: 'Specificity (CSS)', code: '.container p { color: blue; }\np { color: red; }\n/* Why is not the paragraph red? */' };
    } else {
      return { title: 'Variable Shadowing (Python)', code: 'x = 10\n\ndef multiply(val):\n    x = val * 2\n    return x\n\nprint(multiply(5))\nprint(x)\n# Why is x still 10?' };
    }
  }

  if (topic === 'equality_identity') {
    if (language === 'java') {
      return { title: 'String Equality (Java)', code: 'String a = new String("hello");\nString b = new String("hello");\n\nif (a == b) {\n    System.out.println("Equal!");\n} else {\n    System.out.println("Different!");\n}\n// Why does it say they are different?' };
    } else if (language === 'rust') {
      return { title: 'String Equality (Rust)', code: 'let a = String::from("hello");\nlet b = "hello";\n\nif a == b {\n    println!("Equal!");\n}\n// Wait, can we compare a String with a &str like this?' };
    } else if (language === 'c' || language === 'cpp') {
      return { title: 'Pointer Equality (C/C++)', code: 'char* a = "hello";\nchar b[] = "hello";\nif (a == b) {\n    printf("Equal!");\n}\n// Why are not these considered equal?' };
    } else if (language === 'javascript') {
      return { title: 'Equality vs Identity (JS)', code: 'const a = [1, 2, 3];\nconst b = [1, 2, 3];\n\nif (a === b) {\n    console.log("Equal");\n} else {\n    console.log("Different");\n}\n// Why does JS say they are different?' };
    } else if (language === 'html') {
      return { title: 'Semantic Equivalence (HTML)', code: '<b>Important Text</b>\n<strong>Important Text</strong>\n<!-- Do these mean the exact same thing to a screen reader? -->' };
    } else if (language === 'css') {
      return { title: 'Class vs ID (CSS)', code: '#header { color: red; }\n.header { color: blue; }\n/* Are these selecting the same thing? Which wins? */' };
    } else {
      return { title: 'Equality vs Identity (Python)', code: 'a = [1, 2, 3]\nb = [1, 2, 3]\n\nif a is b:\n    print("They are the exact same object!")\nelse:\n    print("They are different objects!")\n\n# Wait, they have the same numbers, why are they different?' };
    }
  }

  if (topic === 'scope') {
    if (language === 'java') {
      return { title: 'Lambda Scope (Java)', code: 'int count = 0;\nRunnable r = () -> {\n    count++;\n};\n// Why does this fail to compile?' };
    } else if (language === 'rust') {
      return { title: 'Immutability (Rust)', code: 'let count = 0;\ncount += 1;\nprintln!("{}", count);\n// Why does the compiler block this?' };
    } else if (language === 'c' || language === 'cpp') {
      return { title: 'Dangling Pointers (C/C++)', code: 'int* getPointer() {\n    int x = 10;\n    return &x;\n}\n// Why does this return a dangling pointer?' };
    } else if (language === 'javascript') {
      return { title: 'Closure Scope (JS)', code: 'for (var i = 0; i < 3; i++) {\n    setTimeout(() => console.log(i), 100);\n}\n// Why does this print 3, 3, 3 instead of 0, 1, 2?' };
    } else if (language === 'html') {
      return { title: 'Form Scope (HTML)', code: '<label for="email">Email:</label>\n<div>\n  <input type="text" id="email_input" />\n</div>\n<!-- Why does not clicking the label focus the input? -->' };
    } else if (language === 'css') {
      return { title: 'Scope (CSS)', code: '.card h2 { font-size: 20px; }\nh2 { font-size: 24px; }\n/* Why is the card heading smaller than the rest? */' };
    } else {
      return { title: 'Scope & Global Keyword (Python)', code: 'count = 0\n\ndef increment():\n    count += 1\n    return count\n\nprint(increment())\n# This throws an UnboundLocalError!' };
    }
  }

  return { title: 'Unknown Challenge', code: '// Not implemented' };
};

export const getVerificationCode = (topic: string, language: string) => {
  if (topic === 'list_iteration') {
    if (language === 'java') return { title: 'Array Iteration (Java)', code: 'double[] prices = {9.99, 14.50, 5.00};\nfor (int i = 1; i <= prices.length; i++) {\n    System.out.println(prices[i]);\n}' };
    if (language === 'rust') return { title: 'Array Iteration (Rust)', code: 'let scores = [10, 20, 30];\nfor i in 1..=scores.len() {\n    println!("{}", scores[i]);\n}' };
    if (language === 'javascript' || language === 'cpp') return { title: 'Array Iteration', code: 'const items = ["apple", "banana", "cherry"];\nfor (let i = 1; i <= items.length; i++) {\n    console.log(items[i]);\n}' };
    if (language === 'c') return { title: 'Array Iteration (C)', code: 'int ages[] = {25, 30, 35};\nfor (int i = 1; i <= 3; i++) {\n    printf("%d\\n", ages[i]);\n}' };
    if (language === 'html') return { title: 'List Iteration (HTML)', code: '<ul>\n  <li>Red</li>\n  <li>Green\n  <li>Blue</li>\n</ul>' };
    if (language === 'css') return { title: 'List Iteration (CSS)', code: 'li:nth-child(0) {\n  color: blue;\n}' };
    return { title: 'List Iteration (Python)', code: 'animals = ["cat", "dog", "bird"]\nfor i in range(1, len(animals)):\n    print(animals[i])' };
  }
  
  if (topic === 'mutable_defaults') {
    if (language === 'java') return { title: 'Static State (Java)', code: 'class UserData {\n    static List<String> logs = new ArrayList<>();\n    void addLog(String log) {\n        logs.add(log);\n    }\n}' };
    if (language === 'javascript') return { title: 'Mutable Default Arguments (JS)', code: 'function addScore(score, scores = []) {\n    scores.push(score);\n    return scores;\n}' };
    return { title: 'Mutable Default Arguments (Python)', code: 'def add_score(score, scores=[]):\n    scores.append(score)\n    return scores\n\nprint(add_score(10))\nprint(add_score(20))' };
  }

  if (topic === 'variable_shadowing') {
    if (language === 'javascript') return { title: 'Variable Shadowing (JS)', code: 'let total = 100;\nfunction updateTotal() {\n    let total = 200;\n}\nupdateTotal();\nconsole.log(total);' };
    return { title: 'Variable Shadowing (Python)', code: 'total = 100\ndef update_total(val):\n    total = val * 2\n    return total\nprint(update_total(50))\nprint(total)' };
  }

  if (topic === 'equality_identity') {
    if (language === 'javascript') return { title: 'Equality vs Identity (JS)', code: 'const arr1 = [5, 5];\nconst arr2 = [5, 5];\nif (arr1 === arr2) {\n    console.log("Match");\n}' };
    return { title: 'Equality vs Identity (Python)', code: 'user1 = {"id": 1}\nuser2 = {"id": 1}\nif user1 is user2:\n    print("Same user!")' };
  }

  if (topic === 'scope') {
    if (language === 'javascript') return { title: 'Closure Scope (JS)', code: 'for (var j = 0; j < 3; j++) {\n    setTimeout(() => console.log(j), 100);\n}' };
    return { title: 'Scope & Global Keyword (Python)', code: 'multiplier = 2\ndef apply_multiplier():\n    multiplier += 1\n    return multiplier\nprint(apply_multiplier())' };
  }

  return getChallengeCode(topic, language);
};


export const verifyFix = (topic: string, language: string, code: string) => {
  let isCorrect = false;
  let successMsg = "Code executed successfully!";
  let errorMsg = "The bug is still present or syntax is incorrect.";

  if (topic === 'list_iteration') {
    if (language === 'java' || language === 'javascript' || language === 'cpp' || language === 'c') {
      if (code.includes('i < numbers.length') || code.includes('i < nums.length') || code.includes('0;') || (language==='c' && (code.includes('i < 3') || code.includes('i=0')))) {
        isCorrect = true;
        successMsg = "1\n2\n3";
      } else {
        errorMsg = "IndexOutOfBoundsException! You went past the end of the array.";
      }
    } else if (language === 'rust') {
      if (code.includes('0..numbers.len()') || code.includes('0..=numbers.len()-1')) {
        isCorrect = true;
      } else {
        errorMsg = "thread 'main' panicked at 'index out of bounds'";
      }
    } else if (language === 'html') {
      if (code.includes('</li>') && code.split('</li>').length >= 4) {
        isCorrect = true;
      } else {
        errorMsg = "The second list item is missing a closing tag!";
      }
    } else if (language === 'css') {
      if (code.includes('nth-child(1)')) {
        isCorrect = true;
      } else {
        errorMsg = "CSS is 1-indexed, not 0-indexed!";
      }
    } else {
      if (code.includes('range(len(') || code.includes('range(0, len(')) {
        isCorrect = true;
      } else {
        errorMsg = "SyntaxError: Missing parentheses in call to 'print'.";
      }
    }
  }

  else if (topic === 'mutable_defaults') {
    if (language === 'java') {
      if (!code.includes('static List') && code.includes('List<String> items = new ArrayList<>();')) {
        isCorrect = true;
      } else {
        errorMsg = "All instances still share the same list because it is static!";
      }
    } else if (language === 'rust') {
      if (code.includes('&mut Vec') || code.includes('lst.clone()')) {
        isCorrect = true;
      } else {
        errorMsg = "borrow of moved value: `my_vec`";
      }
    } else if (language === 'c' || language === 'cpp') {
      if (!code.includes('static int items') || code.includes('malloc')) {
        isCorrect = true;
      } else {
        errorMsg = "The state is still shared because the array is declared static!";
      }
    } else if (language === 'javascript') {
      if (code.includes('list = []') || code.includes('new Array')) {
        isCorrect = true;
      } else {
        errorMsg = "Wait, actually JavaScript evaluates default args at call time, so this works natively!";
      }
    } else if (language === 'html') {
      if (code.includes('id="username1"') || !code.includes('id="username"')) {
        isCorrect = true;
      } else {
        errorMsg = "You still have duplicate IDs on the page!";
      }
    } else if (language === 'css') {
      if (code.includes('.primary') || code.includes('.btn')) {
        isCorrect = true;
      } else {
        errorMsg = "The global button tag is still being styled!";
      }
    } else {
      if (code.includes('my_list=None') || code.includes('my_list is None')) {
        isCorrect = true;
      } else {
        errorMsg = "The list is still being shared between function calls!";
      }
    }
  }

  else if (topic === 'variable_shadowing') {
    if (language === 'java') {
      if (code.includes('this.score =') || (!code.includes('int score = val') && code.includes('score = val'))) isCorrect = true;
      else errorMsg = "The class score still isn't being updated!";
    } else if (language === 'rust') {
      if (!code.includes('let x = x * 2') && code.includes('x = x * 2')) isCorrect = true;
      else errorMsg = "You are still shadowing the variable instead of mutating it!";
    } else if (language === 'c' || language === 'cpp') {
      if (!code.includes('int x = 20') && code.includes('x = 20')) isCorrect = true;
      else errorMsg = "The global x remains 10 because it is shadowed locally!";
    } else if (language === 'javascript') {
      if (!code.includes('let x = 20') && code.includes('x = 20')) isCorrect = true;
      else errorMsg = "The outer x remains 10 because you used `let` inside the function!";
    } else if (language === 'html') {
      if (!code.includes('!important')) isCorrect = true;
      else errorMsg = "The !important flag is still overriding the inline style!";
    } else if (language === 'css') {
      if (code.includes('p.text') || code.includes('!important') || !code.includes('p {')) isCorrect = true;
      else errorMsg = "The specificity isn't high enough to override the container style!";
    } else {
      if (code.includes('global x')) isCorrect = true;
      else errorMsg = "The global x is still 10!";
    }
  }
  
  else if (topic === 'equality_identity') {
    if (language === 'java') {
      if (code.includes('a.equals(b)')) isCorrect = true;
      else errorMsg = "Different! The `==` operator is still checking reference identity.";
    } else if (language === 'rust') {
      if (code.includes('a == b')) isCorrect = true;
      else errorMsg = "Wait, you need to use `a == b` to compare values in Rust!";
    } else if (language === 'c' || language === 'cpp') {
      if (code.includes('strcmp(a, b)')) isCorrect = true;
      else errorMsg = "The pointers point to different memory addresses!";
    } else if (language === 'javascript') {
      if (code.includes('JSON.stringify') || (code.includes('a.every') && code.includes('b.every'))) isCorrect = true;
      else errorMsg = "JS checks array reference identity, not value equality. Try converting to string or iterating!";
    } else if (language === 'html') {
      if (code.includes('<strong>') && !code.includes('<b>')) isCorrect = true;
      else errorMsg = "<b> is not semantically equivalent to <strong> for screen readers!";
    } else if (language === 'css') {
      if (!code.includes('.header')) isCorrect = true;
      else errorMsg = "The ID selector `#header` is still overpowering the class selector!";
    } else {
      if (code.includes('a == b')) isCorrect = true;
      else errorMsg = "They are different objects! `is` checks memory identity.";
    }
  }

  else if (topic === 'scope') {
    if (language === 'java') {
      if (code.includes('AtomicInteger') || code.includes('new int[')) isCorrect = true;
      else errorMsg = "Local variable count defined in an enclosing scope must be final or effectively final!";
    } else if (language === 'rust') {
      if (code.includes('mut count')) isCorrect = true;
      else errorMsg = "cannot assign twice to immutable variable `count`";
    } else if (language === 'c' || language === 'cpp') {
      if (code.includes('malloc') || code.includes('static int')) isCorrect = true;
      else errorMsg = "Warning: function returns address of local variable";
    } else if (language === 'javascript') {
      if (code.includes('let i = 0')) isCorrect = true;
      else errorMsg = "var is function-scoped! By the time setTimeout runs, the loop is already finished.";
    } else if (language === 'html') {
      if (code.includes('for="email_input"')) isCorrect = true;
      else errorMsg = "The label is still not linked properly to the input field!";
    } else if (language === 'css') {
      if (code.includes('.card h2')) isCorrect = true;
      else errorMsg = "The generic `h2` selector doesn't affect the card heading properly.";
    } else {
      if (code.includes('global count')) isCorrect = true;
      else errorMsg = "UnboundLocalError: local variable 'count' referenced before assignment";
    }
  }

  return { isCorrect, successMsg, errorMsg };
};

export const getLearningOutcome = (topic: string, language: string) => {
  if (topic === 'list_iteration') {
    if (language === 'html') return { wrong: ['A closing tag was missing.'], concept: 'HTML Structure', avoid: 'Always close tags properly.' };
    if (language === 'css') return { wrong: ['CSS uses 1-based indexing for nth-child.'], concept: 'CSS Selectors', avoid: 'Use nth-child(1) for the first element.' };
    return {
      wrong: ['The loop index started at 1, skipping the first element.', 'The loop condition was incorrect.'],
      concept: '0-based Indexing. Arrays start at index 0.',
      avoid: 'Always use proper bounds for arrays (e.g. i < length).'
    };
  }

  if (topic === 'mutable_defaults') {
    if (language === 'html') return { wrong: ['Multiple elements had the same ID.'], concept: 'Unique IDs', avoid: 'IDs must be unique in an HTML document.' };
    if (language === 'css') return { wrong: ['A global tag selector was used instead of a class.'], concept: 'CSS Classes', avoid: 'Use classes (.btn) instead of tags for reusable components.' };
    return {
      wrong: ['The state was shared across instances or calls.'],
      concept: 'State Sharing',
      avoid: 'Avoid static or mutable default arguments when separate state is intended.'
    };
  }

  if (topic === 'variable_shadowing') {
    if (language === 'html') return { wrong: ['!important was used, which breaks specificity rules.'], concept: 'CSS Specificity', avoid: 'Avoid !important unless absolutely necessary.' };
    if (language === 'css') return { wrong: ['A less specific selector was overridden by a more specific one.'], concept: 'CSS Specificity', avoid: 'Understand how CSS calculates specificity.' };
    return {
      wrong: ['A new local variable shadowed the outer one.'],
      concept: 'Variable Shadowing',
      avoid: 'Avoid re-declaring variables if you intend to mutate the outer scope.'
    };
  }

  if (topic === 'equality_identity') {
    if (language === 'html') return { wrong: ['<b> was used instead of <strong>.'], concept: 'Semantic HTML', avoid: 'Use semantic tags like <strong> and <em> for screen readers.' };
    if (language === 'css') return { wrong: ['An ID selector and class selector conflicted.'], concept: 'CSS Specificity', avoid: 'IDs have higher specificity than classes.' };
    if (language === 'c') return { wrong: ['Pointers were compared instead of strings.'], concept: 'Pointer vs Value Equality', avoid: 'Use strcmp() to compare string contents in C.' };
    return {
      wrong: ['An identity check was used instead of a value check.'],
      concept: 'Identity vs Equality',
      avoid: 'Use value equality checks (like .equals() or ==) instead of reference checks.'
    };
  }

  if (topic === 'scope') {
    if (language === 'html') return { wrong: ['The label for attribute did not match the input ID.'], concept: 'Accessibility', avoid: 'Always link labels to inputs using the for attribute.' };
    if (language === 'c') return { wrong: ['A pointer to a local variable was returned.'], concept: 'Dangling Pointers', avoid: 'Allocate memory on the heap using malloc() or use static variables.' };
    return {
      wrong: ['A variable was used outside its valid scope or mutability rules.'],
      concept: 'Scope & Mutability',
      avoid: 'Understand how your language handles closures and scope boundaries.'
    };
  }

  return { wrong: ['There was a logic error.'], concept: 'General Debugging', avoid: 'Test edge cases carefully.' };
};
