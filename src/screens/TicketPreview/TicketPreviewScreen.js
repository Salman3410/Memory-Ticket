import {
  useState,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  useWindowDimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMemory } from "../../hooks/useMemory";
import styles from "./ticketPreviewStyles";

function TicketPreviewScreen({
  route,
  navigation,
}) {
  const { addMemory } =
    useMemory();

  const {
    memory,
  } = route.params || {};

  const {
    width: screenWidth,
  } = useWindowDimensions();

  const [
    activeImage,
    setActiveImage,
  ] = useState(0);

  const [
    saving,
    setSaving,
  ] = useState(false);

  if (!memory) {
    return (
      <View
        style={styles.container}
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent:
              "center",
            paddingHorizontal: 30,
          }}
        >
          <Ionicons
            name="alert-circle-outline"
            size={45}
            color="#34345C"
          />

          <Text
            style={{
              fontSize: 20,
              fontWeight: "900",
              color: "#242424",
              marginTop: 15,
              marginBottom: 18,
            }}
          >
            Memory data not found
          </Text>

          <TouchableOpacity
            style={{
              height: 48,
              paddingHorizontal: 22,
              borderRadius: 13,
              backgroundColor:
                "#34345C",
              alignItems: "center",
              justifyContent:
                "center",
            }}
            onPress={() =>
              navigation.navigate(
                "MainTabs",
                {
                  screen:
                    "Create",
                },
              )
            }
          >
            <Text
              style={{
                fontSize: 10,
                fontWeight: "900",
                letterSpacing: 1,
                color: "#FFFFFF",
              }}
            >
              CREATE MEMORY
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const images =
    Array.isArray(
      memory.images,
    )
      ? memory.images
      : memory.image
        ? [memory.image]
        : [];

  const formatDate = (
    date,
  ) => {
    if (!date) {
      return "DATE UNKNOWN";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime(),
      )
    ) {
      return "DATE UNKNOWN";
    }

    return parsedDate.toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "2-digit",
        year: "numeric",
      },
    );
  };

  const getTicketNumber = () => {
    if (memory?.id) {
      return memory.id
        .slice(-5)
        .toUpperCase();
    }

    return "00001";
  };

  const handleSave =
    async () => {
      if (saving) {
        return;
      }

      try {
        if (!images.length) {
          Alert.alert(
            "No Photos",
            "This memory doesn't contain any photos.",
          );

          return;
        }

        setSaving(true);

        const savedMemory = await addMemory({
          title: memory.title || "",
          location: memory.location || "",
          locationData: memory.locationData || null,
          description: memory.description || "",
          images: [...images],
          date: memory.date || new Date().toISOString(),
          favorite: false,
          environment: memory.environment || null,
        });

        if (!savedMemory) {
          throw new Error("Memory was not created.");
        }

        navigation.navigate("MainTabs", {
          screen: "Memories",
        });
      } catch (error) {
        console.error(
          "Error saving memory:",
          error,
        );

        Alert.alert(
          "Save Failed",
          error?.message ||
            "Unable to save memory.",
        );
      } finally {
        setSaving(false);
      }
    };

  const handleEdit = () => {
    if (saving) {
      return;
    }

    navigation.navigate("MainTabs", {
      screen: "Create",
      params: {
        editMemory: {
          ...memory,
          images: [...images],
          image: images[0] || memory.image || null,
          location: memory.location || "",
          locationData: memory.locationData || null,
        },
      },
    });
  };

  const renderTicket = (
    image,
    index,
  ) => {
    return (
      <View
        key={`ticket-${index}-${image}`}
        style={[
          styles.ticketSlide,
          {
            width:
              screenWidth - 44,
            marginRight: 12,
          },
        ]}
      >
        <View
          style={
            styles.ticketShadow
          }
        >
          <View
            style={styles.ticket}
          >
            {/* TOP PERFORATION */}

            <View
              style={
                styles.topPerforation
              }
            >
              {Array.from({
                length: 15,
              }).map(
                (_, holeIndex) => (
                  <View
                    key={holeIndex}
                    style={
                      styles.perforationHole
                    }
                  />
                ),
              )}
            </View>

            {/* HEADER */}

            <View
              style={
                styles.ticketHeader
              }
            >
              <View>
                <Text
                  style={
                    styles.ticketBrand
                  }
                >
                  MEMENTO
                </Text>

                <Text
                  style={
                    styles.ticketSubBrand
                  }
                >
                  THE POWER OF THE MOMENT
                </Text>
              </View>

              <Text
                style={
                  styles.ticketNumber
                }
              >
                #{getTicketNumber()}
              </Text>
            </View>

            {/* IMAGE */}

            <View
              style={
                styles.ticketImageContainer
              }
            >
              {image ? (
                <Image
                  source={{
                    uri: image,
                  }}
                  style={
                    styles.ticketImage
                  }
                  resizeMode="cover"
                />
              ) : (
                <View
                  style={
                    styles.noImage
                  }
                >
                  <Ionicons
                    name="image-outline"
                    size={42}
                    color="#D94D28"
                  />

                  <Text
                    style={
                      styles.noImageText
                    }
                  >
                    NO IMAGE
                  </Text>
                </View>
              )}

              {images.length > 1 && (
                <View
                  style={
                    styles.imageCounter
                  }
                >
                  <Text
                    style={
                      styles.imageCounterText
                    }
                  >
                    {index + 1}/
                    {images.length}
                  </Text>
                </View>
              )}

              {images.length > 1 && (
                <View
                  style={
                    styles.imageDots
                  }
                >
                  {images.map(
                    (_, dotIndex) => (
                      <View
                        key={
                          dotIndex
                        }
                        style={[
                          styles.imageDot,
                          dotIndex ===
                            activeImage &&
                            styles.imageDotActive,
                        ]}
                      />
                    ),
                  )}
                </View>
              )}
            </View>

            {/* INFORMATION */}

            <View
              style={
                styles.ticketInfo
              }
            >
              <Text
                style={
                  styles.memoryLabel
                }
              >
                MEMORY
              </Text>

              <Text
                style={
                  styles.ticketTitle
                }
                numberOfLines={2}
              >
                {memory.title ||
                  "UNTITLED MEMORY"}
              </Text>

              <View
                style={
                  styles.ticketDivider
                }
              />

              <View
                style={
                  styles.infoRow
                }
              >
                <View
                  style={
                    styles.infoItem
                  }
                >
                  <Text
                    style={
                      styles.infoLabel
                    }
                  >
                    DATE
                  </Text>

                  <Text
                    style={
                      styles.infoValue
                    }
                  >
                    {formatDate(
                      memory.date,
                    )}
                  </Text>
                </View>

                <View
                  style={
                    styles.infoItem
                  }
                >
                  <Text
                    style={
                      styles.infoLabel
                    }
                  >
                    LOCATION
                  </Text>

                  <Text
                    style={
                      styles.infoValue
                    }
                    numberOfLines={2}
                  >
                    {memory.location ||
                      "UNKNOWN"}
                  </Text>
                </View>
              </View>

              {memory.description ? (
                <View
                  style={
                    styles.descriptionContainer
                  }
                >
                  <Text
                    style={
                      styles.description
                    }
                  >
                    {memory.description}
                  </Text>
                </View>
              ) : null}
            </View>

            {/* MIDDLE PERFORATION */}

            <View
              style={
                styles.middlePerforation
              }
            >
              <View
                style={
                  styles.sideCutoutLeft
                }
              />

              <View
                style={
                  styles.middleDashedLine
                }
              />

              <View
                style={
                  styles.sideCutoutRight
                }
              />
            </View>

            {/* FOOTER */}

            <View
              style={
                styles.ticketFooter
              }
            >
              <View>
                <Text
                  style={
                    styles.admitText
                  }
                >
                  ADMISSION X1
                </Text>

                <Text
                  style={
                    styles.footerSmallText
                  }
                >
                  MEMORY ARCHIVE
                </Text>
              </View>

              <View
                style={
                  styles.barcode
                }
              >
                {Array.from({
                  length: 28,
                }).map(
                  (_, barIndex) => (
                    <View
                      key={
                        barIndex
                      }
                      style={[
                        styles.bar,
                        barIndex %
                          5 ===
                          0
                          ? styles.barWide
                          : barIndex %
                              3 ===
                            0
                            ? styles.barMedium
                            : styles.barSmall,
                      ]}
                    />
                  ),
                )}
              </View>
            </View>

            {/* SERIAL */}

            <View
              style={
                styles.serialContainer
              }
            >
              <Text
                style={
                  styles.serialText
                }
              >
                MT •{" "}
                {getTicketNumber()}
              </Text>
            </View>

            {/* BOTTOM PERFORATION */}

            <View
              style={
                styles.bottomPerforation
              }
            >
              {Array.from({
                length: 15,
              }).map(
                (_, holeIndex) => (
                  <View
                    key={
                      holeIndex
                    }
                    style={
                      styles.perforationHole
                    }
                  />
                ),
              )}
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.scrollContent
        }
        nestedScrollEnabled
      >
        {/* HEADER */}

        <View
          style={styles.header}
        >
          <TouchableOpacity
            style={
              styles.backButton
            }
            onPress={() =>
              navigation.goBack()
            }
            disabled={saving}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-back"
              size={21}
              color="#242424"
            />
          </TouchableOpacity>

          <View
            style={
              styles.headerTextContainer
            }
          >
            <Text
              style={
                styles.headerEyebrow
              }
            >
              YOUR MEMORY
            </Text>

            <Text
              style={
                styles.headerTitle
              }
            >
              Ticket Preview
            </Text>
          </View>

          <View
            style={
              styles.headerSpacer
            }
          />
        </View>

        {/* INTRO */}

        <View
          style={
            styles.previewHeader
          }
        >
          <Text
            style={
              styles.previewTitle
            }
          >
            Looks good?
          </Text>

          <Text
            style={
              styles.previewSubtitle
            }
          >
            This moment is ready to
            become a ticket.
          </Text>
        </View>

        {/* TICKET CAROUSEL */}

        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={
            false
          }
          nestedScrollEnabled
          decelerationRate="fast"
          snapToInterval={
            screenWidth - 32
          }
          snapToAlignment="start"
          disableIntervalMomentum
          onMomentumScrollEnd={(
            event,
          ) => {
            const index =
              Math.round(
                event.nativeEvent
                  .contentOffset
                  .x /
                  (screenWidth -
                    32),
              );

            setActiveImage(
              index,
            );
          }}
        >
          {images.length > 0
            ? images.map(
                (
                  image,
                  index,
                ) =>
                  renderTicket(
                    image,
                    index,
                  ),
              )
            : renderTicket(
                null,
                0,
              )}
        </ScrollView>

        {/* SWIPE HINT */}

        {images.length > 1 && (
          <View
            style={
              styles.swipeHint
            }
          >
            <Ionicons
              name="swap-horizontal-outline"
              size={16}
              color="#9A99A5"
            />

            <Text
              style={
                styles.swipeHintText
              }
            >
              SWIPE TO VIEW MORE
              PHOTOS
            </Text>
          </View>
        )}

        {/* ACTIONS */}

        <View
          style={
            styles.actionsContainer
          }
        >
          <TouchableOpacity
            style={[
              styles.saveButton,
              saving &&
                styles.saveButtonDisabled,
            ]}
            onPress={
              handleSave
            }
            disabled={saving}
            activeOpacity={0.85}
          >
            {saving ? (
              <>
                <ActivityIndicator
                  size="small"
                  color="#FFFFFF"
                />

                <Text
                  style={
                    styles.saveButtonText
                  }
                >
                  SAVING...
                </Text>
              </>
            ) : (
              <>
                <Ionicons
                  name="bookmark-outline"
                  size={20}
                  color="#FFFFFF"
                />

                <Text
                  style={
                    styles.saveButtonText
                  }
                >
                  SAVE MEMORY
                </Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={
              styles.editButton
            }
            onPress={
              handleEdit
            }
            disabled={saving}
            activeOpacity={0.8}
          >
            <Ionicons
              name="create-outline"
              size={19}
              color="#34345C"
            />

            <Text
              style={
                styles.editButtonText
              }
            >
              EDIT
            </Text>
          </TouchableOpacity>
        </View>

        <Text
          style={
            styles.footerText
          }
        >
          Every moment deserves a
          ticket.
        </Text>
      </ScrollView>
    </View>
  );
}

export default TicketPreviewScreen;

