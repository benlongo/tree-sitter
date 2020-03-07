/* global mergeInto, LibraryManager, Module, setValue, stringToUTF16, UTF8ToString */
/* eslint-disable object-shorthand, func-names, comma-dangle */
mergeInto(LibraryManager.library, {
  tree_sitter_parse_callback: function (
    inputBufferAddress,
    index,
    row,
    column,
    lengthAddress
  ) {
    const INPUT_BUFFER_SIZE = 10 * 1024;
    const string = Module.currentParseCallback(index, { row: row, column: column });
    if (typeof string === 'string') {
      setValue(lengthAddress, string.length, 'i32');
      stringToUTF16(string, inputBufferAddress, INPUT_BUFFER_SIZE);
    } else {
      setValue(lengthAddress, 0, 'i32');
    }
  },

  tree_sitter_log_callback: function (_payload, isLexMessage, messageAddress) {
    if (Module.currentLogCallback) {
      const message = UTF8ToString(messageAddress);
      Module.currentLogCallback(message, isLexMessage !== 0);
    }
  },
});
