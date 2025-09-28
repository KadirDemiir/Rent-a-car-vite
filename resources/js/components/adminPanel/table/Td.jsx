export default function Td({ contents, as = "td", cls = "border border-gray-500 px-4 py-2", onClick= null}) {
    const Tag = as;

    return contents.map((item, index) => {
        if (typeof item === "object" && item !== null && "content" in item && "cls" in item) {
            return (
                <Tag key={index} className={`${cls} ${item.cls}`} onClick={() => onClick(item.content)}>
                    {item.content}
;                </Tag>
            );
        } else {
            return (
                <Tag key={index} className={cls} onClick={() => onClick(item)}>
                    {item}
                </Tag>
            );
        }
    });
}
