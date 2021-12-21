import csv

# highlight first user image to last message
s = """
<copied text here>
"""

def find_answer(a):
    potential_answers = []
    answer = []
    for p in a:
        for c in p:
            if c.isdigit():
                answer.append(c)
                continue
            elif answer:
                potential_answers.append("".join(answer))
            answer = []
    if answer:
        potential_answers.append("".join(answer))
    return int(potential_answers[0]) if potential_answers else 10000

# u_a = [(p[0].split(':')[0].split('  ')[0], int(find_answer(p[1:])[0])) for p in [[ii for ii in i.split('\n') if ii.strip()] for i in s.strip().split('\n\n') if i]]
u_a = [(p[0].split(':')[0].split('  ')[0], find_answer(p[1:])) for p in [[ii for ii in i.split('\n') if ii.strip()] for i in s.strip().split('\n\n') if i]]
u_a = [(u, a) for u, a in u_a if a <= 1000]

with open("answers.csv", "w") as out:
    writer = csv.writer(out)
    writer.writerow(["user", "answer"])
    writer.writerows(u_a)
