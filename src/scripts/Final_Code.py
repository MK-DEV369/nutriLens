with open("PaddlePart.py") as f1:
    code1 = f1.read()
    exec(code1)
    
with open("Model.py") as f2:
    code2 = f2.read()
    exec(code2)