export default function Td({ contents, as = "td", cls = "" }) {
    const Tag = as;

    if (Array.isArray(contents)) {
        return contents.map((item, index) => (
            <Tag key={index} className={cls}>
                {item}
            </Tag>
        ));
    }

    return <Tag className={cls}>{contents}</Tag>;
}
