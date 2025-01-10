const formatDate = (date) => (date ? date.toISOString().split("T")[0] : null);

const timestampFormatter = (schema) => {
    schema.set("toJSON", {
        virtuals: true, // Include virtual properties
        transform: (doc, ret) => {
            if (ret.createdAt) ret.createdAt = formatDate(ret.createdAt);
            if (ret.updatedAt) ret.updatedAt = formatDate(ret.updatedAt);
            return ret;
        },
    });

    schema.set("toObject", {
        virtuals: true, // Include virtual properties
        transform: (doc, ret) => {
            if (ret.createdAt) ret.createdAt = formatDate(ret.createdAt);
            if (ret.updatedAt) ret.updatedAt = formatDate(ret.updatedAt);
            return ret;
        },
    });
};

module.exports = timestampFormatter;
