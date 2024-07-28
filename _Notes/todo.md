# 072624

# MVP

- [] Finished Conditions:

  - [x] Can execute a simple chained llm call
  - [] Can save and restore graphs

- [] Add api key input for single provider (options come later)
- [] finish basic llmNode

  - [x] input and output ui
  - [x] setup call to llm with input and display output response.

    - [] add markdown output

  - [x] Handle LLM node data (passing output)

    - ? generate instruction set to be interpreted; just append the output to the; blah blah, you know.

================
POST_MVP
================

- [] Setup Context around mainflow so customnodes can communicate with the main view.

  - [] Setup editing panel UI for detailed node settings when selected
    | This may not need context; check reactflow props "onNodeSelected" ?

**LLMNode**

- [] Add status text: Idle, waiting for input, waiting response, error, etc.
- [] Style nodes and edges based on status;
  | e.g. edges can maybe have a spinner or something... or better, just color with anim
- [] Add option to wait for all sources to update input before running
- [] Add "Auto run" toggle which governs whether the llm is called as soon as source is updated
- [] Add token count and estimated cost based on LLMProvider type, and estimated input+max output tokens along the chain
  | Token count should be per node as well as for the for the whole flow
- [] Add check for loops and highlight these/alert user.
  - [] Add handling; e.g. setting a limit to how many times the node can execute in a complete flow run

**Module Imports**
Note: referring to an entire graph as a "Module"

- [] Modules can be imported via a module node.
- [] Modules can have their own inputs and outputs
  ? These can either be set in settings and referenced via module-level variables, and/or perhaps each module has a "Root node" that is specially designed for taking module level input, and a "Module Data Output" node that handles sending any data out.

========================
Features Brainstorm
=========================

**Generated Node Titles**

- use llm to generate a title for the node based on its usage (initially, just use the input/sys prompt)

**Dynamic/Editable Handles (connection points):**

- Allow custom labels for each input and output handle;
  - e.g. for input, can have different variables input, then denote those in the limit to the next LLM.
    - Input variables can be used as variables in prompt "${INPUT_VAR}"
      -e.g. for output, llm nodes can optionally output each part of the response.. messages, token usage, etc.
  - \*\*Note: Consider setting dynamic outputs based on object type.

**Formatting Tags**

- Add tags or some method to append/inject pre-made prompts which govern the output format (e.g. JSON)

**Other Node Types**

- APINode: Allows calling an API

  - has "RUN" action handle, which can be triggered
  - has response output
  - can be configed to run automatically or on some condition

- Page Generation
  - generates a link to a page which is generated based on inputs (like a dynamic react page, or websim style)
    -NOTE: This made me consider "module"-level inputs and outputs and then the Page Generator node is just a Module Import note which imports the PageGenerator module, and takes various inputs to build and style the page, etc.

**Node View types**
Can condense nodes to just basic summary (e.g. Title and status for LLMNode)
Or, double click to expand to a medium-sized edit mode

- Can have options to collapse/expand all nodes

**Community Features**

- Build and share modules
- Rate Modules
