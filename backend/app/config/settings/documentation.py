def common_block_generator(list_item,type):
    if(len(list_item)>0):
        block = (f"### {type}: \n")
        for item in list_item:
            block+=f"- {item}\n"
        return block
    return ""

def generate_doc(method,
                 description,
                 preconditions=[],
                 postconditions=[],
                 notes=[],
                 parameters=[],
                 responses=[]):
    doc = (
        f"## {method}:\n"
        f"{description}\n\n"
        f"{common_block_generator(preconditions,'Preconditions')}"
        f"{common_block_generator(postconditions,'Postconditions')}"
        f"{common_block_generator(notes,'Notes')}"
        f"{common_block_generator(parameters,'Parameters')}"
        f"{common_block_generator(responses,'Responses')}"
    )
    return doc