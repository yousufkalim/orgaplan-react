import React from "react";

const Tags = ({ data = [], onPress, disabled }) => (
  <View
    style={{
      flexWrap: "wrap",
      flexDirection: "row",
    }}
  >
    {data.map((item) => (
      <TouchableOpacity
        key={item.key}
        activeOpacity={0.8}
        disabled={disabled}
        onPress={() => onPress && onPress(item)}
        style={{
          height: hp(3.5),
          marginRight: wp(0.5),
          alignItems: "center",
          paddingHorizontal: 10,
          justifyContent: "center",
          backgroundColor: item.delivered ? Colors.RED : Colors.BORDER_GRAY,
          borderRadius: Dimensions.BORDER_RADIUS,
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: RFValue(8.5),
            fontFamily: Fonts.HELVETICANEUE,
          }}
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

export default Tags;
